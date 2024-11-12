import { CameraControllerBase } from "./CameraControllerBase";
import { CamerasId } from "@constants/CamerasId";
import { MainThree } from "../../MainThree";
import { OrthographicCamera } from "three";

export class OrthographicCameraControllerBase extends CameraControllerBase {
  declare public camera: OrthographicCamera;
  public aspectRatio: number;
  
  constructor(cameraId: CamerasId) {
    super(cameraId);

    this.camera = new OrthographicCamera(-1, 1, 1, -1);
    this.updateCameraAspect();

    this.cameraContainer.add(this.camera);
  }

  updateCameraAspect() {
    const aspect = MainThree.DomElementContainer.offsetWidth / MainThree.DomElementContainer.offsetHeight;

    this.camera.left = -this.aspectRatio;
    this.camera.right = this.aspectRatio;
    this.camera.top = this.aspectRatio / aspect;
    this.camera.bottom = -this.aspectRatio / aspect;

    this.camera.updateProjectionMatrix();
  }

  onResize = () => {
    this.updateCameraAspect();
  }
}