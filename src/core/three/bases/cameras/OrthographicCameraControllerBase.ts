import { CameraControllerBase } from "./CameraControllerBase";
import { CamerasId } from "@constants/CamerasId";
import { MainThree } from "../../MainThree";
import { OrthographicCamera } from "three";

export class OrthographicCameraControllerBase extends CameraControllerBase {
  public declare camera: OrthographicCamera;
  public aspectRatio: number = window.innerWidth / window.innerHeight;
  protected _domElementSet = false;
  protected viewSize = 1;

  constructor(cameraId: CamerasId) {
    super(cameraId);

    // Initialisation avec des valeurs par défaut
    this.camera = new OrthographicCamera(-1, 1, 1, -1);

    if (MainThree.DomElementContainer) {
      this._domElementSet = true;
    } else {
      MainThree.OnDomElementContainerSet.add(this.setCameraAspectOnInit);
    }

    this.cameraContainer.add(this.camera);
  }

  public setCameraAspectOnInit = (): void => {
    this._domElementSet = true;
  };
}
