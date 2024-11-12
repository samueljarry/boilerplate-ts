import { CamerasId } from '../constants/CamerasId';
import { OrthographicCameraControllerBase } from '../core/three/bases/cameras/OrthographicCameraControllerBase';

export class DummyOrthographicCameraController extends OrthographicCameraControllerBase {
  constructor() {
    super(CamerasId.DUMMY_ORTHOGRAPHIC);

    this.camera.position.z = -5;
  }
}
 