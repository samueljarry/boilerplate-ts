import { Camera, Object3D } from "three";

import { CamerasId } from "@constants/CamerasId";
import { DomEvents } from "../../../common/constants/DomEvents";
import { MainThree } from "@core/three/MainThree";

export class CameraControllerBase extends Object3D {
  public isOrbitCamera = false;
  public cameraId: CamerasId;
  public camera: Camera = null;
  public cameraContainer = new Object3D();
  public started = false;
  protected _domElementContainer: HTMLElement;

  constructor(cameraId: CamerasId) {
    super();
    this.cameraId = cameraId;

    this.add(this.cameraContainer);
  }

  start() {
    this.started = true;

    MainThree.OnResize.add(this.onResize);
    this.onResize();
  }

  stop() {
    this.started = false;

    MainThree.OnResize.remove(this.onResize);
  }

  setDomElementContainer(domElementContainer: HTMLElement) {
    this._domElementContainer = domElementContainer;
  }

  onResize = () => {};
}