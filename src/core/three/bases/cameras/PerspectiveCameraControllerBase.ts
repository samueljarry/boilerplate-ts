import { CameraControllerBase } from "./CameraControllerBase";
import { CamerasId } from "@constants/CamerasId";
import { PerspectiveCamera } from "three";

export class PerspectiveCameraControllerBase extends CameraControllerBase {
  declare public camera: PerspectiveCamera;

  constructor(cameraId: CamerasId) {
    super(cameraId);
    
    this.camera = new PerspectiveCamera(75, this.getAspect(), 0.1, 10000)
    this.cameraContainer.add(this.camera);
  }

  getAspect() {
    return this._domElementContainer 
      ? this._domElementContainer.offsetWidth / this._domElementContainer.offsetHeight
      : window.innerWidth / window.innerHeight
  }

  onResize = () => {
    this.camera.aspect = this.getAspect();
    this.camera.updateProjectionMatrix();
  }
}