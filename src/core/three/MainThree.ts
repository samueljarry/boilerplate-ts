import { ClearPass, EffectComposer, EffectPass, Pass, RenderPass } from "postprocessing";
import { CubeTexture, DataTexture, HalfFloatType, Scene, Vector2, WebGLRenderer } from "three";

import { Action } from "../common/utils/Action";
import { AssetsId } from '../../constants/AssetsId';
import { CameraControllerBase } from "./bases/cameras/CameraControllerBase";
import { CamerasId } from "../../constants/CamerasId";
import { CamerasManager } from "./managers/CamerasManager";
import { DefaultCameraController } from "@controllers/cameras/DebugCameraController";
import { DomEvents } from "@core/common/constants/DomEvents";
import { ThreeAssetsManager } from "./managers/ThreeAssetsManager";
import { ThreeInteractiveManager } from "./managers/ThreeInteractiveManager";
import { ThreeViewBase } from "./bases/ThreeViewBase";
import { Ticker } from "@core/common/utils/Ticker";
import { ViewId } from '@constants/LayoutConstants'
import { ViewsManager } from "@core/common/managers/ViewsManager";
import { debounce } from '@core/common/utils/debounce';

export class MainThree {
  public static POSTPROCESSING_ENABLED = false;
  
  public static IsInit = false;
  public static IsStarted = false;
  public static OnResize = new Action();
  public static OnDomElementContainerSet = new Action();
  
  private static _Scene = new Scene();
  private static _Renderer: WebGLRenderer;
  private static _Composer: EffectComposer;

  private static _DomSize = new Vector2();
  private static _DomElementContainer: HTMLElement;

  private static _CurrentCameraController: CameraControllerBase;
  private static _PreviousCameraController: CameraControllerBase;

  public static Init(): void {
    this._SetRenderer();

    ViewsManager.OnViewsChange.add(this._OnViewsChange);
    CamerasManager.OnCameraChange.add(this._ChangeCamera);

    this.IsInit = true;
  }

  // #region renderers
  private static _SetRenderer(): void {
    this._Renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      stencil: true,
      powerPreference: 'high-performance',
    });

    this._Renderer.setSize(window.innerWidth, window.innerHeight);
    this._Renderer.setPixelRatio(window.devicePixelRatio);
    this._Renderer.autoClear = true;
    this._Renderer.autoClearStencil = true
  }

  private static _SetComposer(): void {
    this._Composer = new EffectComposer(this._Renderer, {
      // frameBufferType: HalfFloatType,
      stencilBuffer: true
    });

    const renderPass = new RenderPass(this._Scene, this._CurrentCameraController.camera);
    const clearPass = new ClearPass(true, true, true)
    
    this._Composer.addPass(renderPass)
    this._Composer.addPass(clearPass)
  }
  // #endregion

  // #region events handling
  public static Start(): void {
    ViewsManager.Show(ViewId.MAIN_THREE);
    this.IsStarted = true;
    this._SetListeners();
    
    ThreeInteractiveManager.Start(this._DomElementContainer);
    Ticker.Add(this._Update);
  }

  public static Stop(): void {
    ViewsManager.Hide(ViewId.MAIN_THREE);
    this.IsStarted = false;
    this._RemoveListeners();
    
    ThreeInteractiveManager.Stop();
    Ticker.Remove(this._Update);
  }

  private static _SetListeners(): void {
    window.addEventListener(DomEvents.RESIZE, this._OnResize);
  }

  private static _RemoveListeners(): void {
    window.removeEventListener(DomEvents.RESIZE, this._OnResize);
  }

  private static _OnViewsChange = (): void => {
    // Remove old views
    for (const child of this._Scene.children) {
      if (child instanceof ThreeViewBase) {
        this._Scene.remove(child);
      }
    }

    for (const view of ViewsManager.GetDisplayedViews()) {
      if (view instanceof ThreeViewBase) {
        this._Scene.add(view);
      }
    }
  };

  private static _OnResize = (): void => {
    this._Renderer.setSize(window.innerWidth, window.innerHeight);
    this._Composer.setSize(window.innerWidth, window.innerHeight);
    this.OnResize.execute();
  };

  private static _CheckResize(): void {
    if(this._DomSize.x !== window.innerWidth || this._DomSize.y !== window.innerHeight) {
      this._DomSize.set(
        window.innerWidth,
        window.innerHeight
      );

      debounce(this.OnResize.execute, 100);
    }
  }

  private static _Update = (dt: number): void => {
    this._CheckResize();
    this._UpdateCameraController();
    this._Render(dt);
  };

  private static _Render(dt: number): void {
    if(this.POSTPROCESSING_ENABLED) {
      this._Composer.render(dt)
    } else {
      this._Renderer.render(this._Scene, this._CurrentCameraController.camera);
    }
  }
  // #endregion

  // #region public funcs
  public static SetHdr(hdrId: AssetsId): void {
    let hdr: CubeTexture | DataTexture = ThreeAssetsManager.GetHdr(hdrId);
    if(!hdr) {
      hdr = ThreeAssetsManager.GetCubeTexture(hdrId) as CubeTexture;
    }
    
    this._Scene.environment = hdr;
  }

  public static SetDomElementContainer(domElementContainer: HTMLElement): void {
    this._DomElementContainer = domElementContainer;
    this._DomElementContainer.appendChild(this._Renderer.domElement);

    CamerasManager.SetDomElementContainer(this.DomElementContainer);
    
    this.OnDomElementContainerSet.execute();
    this.OnDomElementContainerSet.clear()
  }

  public static AddPass(pass: Pass): void {
    this._Composer.addPass(pass);
  }

  public static RemovePass(pass: Pass): void {
    this._Composer.removePass(pass);
  }
  // #endregion

  // #region cameras handling
  private static _ChangeCamera = (): void => {
    this._PreviousCameraController = this._CurrentCameraController;
    
    this._CurrentCameraController = CamerasManager.GetCamera(
      CamerasManager.ActiveCameraId
    );
    this._CurrentCameraController.start();

    if(!this._PreviousCameraController) {
      this._OnFirstCameraSet();
    }

    ThreeInteractiveManager.SetCamera(this._CurrentCameraController.camera);

    if (this._PreviousCameraController) {
      this._Scene.remove(this._PreviousCameraController);
    }

    this._Scene.add(this._CurrentCameraController);
    this._OnResize();
  };

  public static SetCamera(cameraId: CamerasId): void {
    CamerasManager.SetActiveCamera(cameraId);
  }

  private static _OnFirstCameraSet(): void {
    this._SetComposer();
  }

  private static _UpdateCameraController(): void {
    if (!this._CurrentCameraController?.cameraId) return;
    if (
      this._CurrentCameraController.cameraId === CamerasId.DEBUG_CAMERA &&
      (this._CurrentCameraController as DefaultCameraController).orbit.enabled
    ) {
      (this._CurrentCameraController as DefaultCameraController).orbit.update();
    }
  }
  // #endregion
  
  // #region getters setters
  public static get Camera(): CameraControllerBase {
    return this._CurrentCameraController;
  }
  public static get Renderer(): WebGLRenderer {
    return this._Renderer;
  }
  public static get DomElementContainer(): HTMLElement {
    return this._DomElementContainer;
  }
  public static get Scene(): Scene {
    return this._Scene;
  }
  public static get Composer(): EffectComposer {
    return this._Composer;
  }
  // #endregion
}