import { CamerasId } from "@constants/CamerasId";
import { PerspectiveCameraControllerBase } from "@core/three/bases/cameras/PerspectiveCameraControllerBase";
import { Vector3 } from "three";

export class DefaultCameraController extends PerspectiveCameraControllerBase {
  constructor() {
    super(CamerasId.DEFAULT_CAMERA);

    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(new Vector3(0,0,0));
  }
}