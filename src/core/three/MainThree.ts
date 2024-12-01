import { Scene, WebGLRenderer } from "three";

import { Action } from "../common/utils/Action";
import { AssetsId } from '../../constants/AssetsId';
import { CameraControllerBase } from "./bases/cameras/CameraControllerBase";
import { CamerasId } from "../../constants/CamerasId";
import { CamerasManager } from "./managers/CamerasManager";
import { DebugCameraController } from "src/controllers/DebugCameraController";
import { DomEvents } from "@core/common/constants/DomEvents";
import { Object3DBase } from "./bases/Object3DBase";
import { ThreeAssetsManager } from "./managers/ThreeAssetsManager";
import { ThreeInteractiveManager } from "./managers/ThreeInteractiveManager";
import { ThreeViewBase } from "./bases/ThreeViewBase";
import { Ticker } from "@core/common/utils/Ticker";
import { ViewId } from "@constants/ViewId";
import { ViewsManager } from "@core/common/managers/ViewsManager";

export class MainThree {
  private static _Scene = new Scene();
  public static IsInit = false;
  public static IsStarted = false;
  public static OnResize = new Action();
  public static OnDomElementContainerSet = new Action();

  private static _Renderer: WebGLRenderer;
  private static _DomElementContainer: HTMLElement;
  private static _CurrentCameraController: CameraControllerBase;
  private static _PreviousCameraController: CameraControllerBase;

  public static Init(): void {
    this._SetRenderer();

    ViewsManager.OnViewsChange.add(this._OnViewsChange);

    CamerasManager.OnCameraChange.add(this._ChangeCamera);
    this.IsInit = true;
  }

  public static Start(): void {
    ViewsManager.Show(ViewId.MAIN_THREE);
    this.IsStarted = true;
    this._SetListeners();
    if (this.DomElementContainer)
      ThreeInteractiveManager.Start(this.DomElementContainer);
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

  private static _SetRenderer(): void {
    this._Renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this._Renderer.setSize(window.innerWidth, window.innerHeight);
    this._Renderer.pixelRatio = window.devicePixelRatio;
  }

  public static SetHdr(hdrId: AssetsId): void {
    this._Scene.environment = ThreeAssetsManager.GetHdr(hdrId);
  }

  private static _OnViewsChange = (): void => {
    // Remove old views
    for (const child of this._Scene.children) {
      if (child instanceof Object3DBase) {
        this._Scene.remove(child);
      }
    }

    for (const view of ViewsManager.GetDisplayedViews()) {
      if (view instanceof ThreeViewBase) {
        this._Scene.add(view);
      }
    }
  };

  public static SetDomElementContainer(domElementContainer: HTMLElement): void {
    this._DomElementContainer = domElementContainer;
    this._DomElementContainer.appendChild(this._Renderer.domElement);

    CamerasManager.SetDomElementContainer(this.DomElementContainer);
    this.OnDomElementContainerSet.execute();
  }

  private static _ChangeCamera = (): void => {
    this._PreviousCameraController = this._CurrentCameraController;
    this._CurrentCameraController = CamerasManager.GetCamera(
      CamerasManager.ActiveCameraId
    );
    this._CurrentCameraController.start();

    ThreeInteractiveManager.SetCamera(this._CurrentCameraController.camera);

    if (this._PreviousCameraController) {
      this._Scene.remove(this._PreviousCameraController);
    }

    this._Scene.add(this._CurrentCameraController);
    this._OnResize();
  };

  private static _OnResize = (): void => {
    this._Renderer.setSize(window.innerWidth, window.innerHeight);
    this.OnResize.execute();
  };

  private static _Update = (): void => {
    if (!this._CurrentCameraController?.cameraId) return;
    if (
      this._CurrentCameraController.cameraId === CamerasId.DEBUG_CAMERA &&
      (this._CurrentCameraController as DebugCameraController).orbit.enabled
    ) {
      (this._CurrentCameraController as DebugCameraController).orbit.update();
    }
    this._Renderer.render(this._Scene, this._CurrentCameraController.camera);
  };

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
  // #endregion
}