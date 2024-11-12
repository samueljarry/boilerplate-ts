import { Camera, Object3D } from "three";

import { CamerasId } from "@constants/CamerasId";
import { DomEvents } from "../../../common/constants/DomEvents";

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

    window.addEventListener(DomEvents.RESIZE, this.onResize);
    this.onResize();
  }

  stop() {
    this.started = false;

    window.removeEventListener(DomEvents.RESIZE, this.onResize);
  }

  setDomElementContainer(domElementContainer: HTMLElement) {
    this._domElementContainer = domElementContainer;
  }

  onResize = () => {};
}