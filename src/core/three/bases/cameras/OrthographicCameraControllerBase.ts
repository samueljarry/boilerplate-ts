import { CameraControllerBase } from "./CameraControllerBase";
import { CamerasId } from "@constants/CamerasId";
import { MainThree } from "../../MainThree";
import { OrthographicCamera } from "three";

export class OrthographicCameraControllerBase extends CameraControllerBase {
  declare public camera: OrthographicCamera;
  public aspectRatio: number = window.innerWidth / window.innerHeight;
  protected _domElementSet = false;
  
  constructor(cameraId: CamerasId) {
    super(cameraId);

    this.camera = new OrthographicCamera(-1, 1, 1, -1);
    
    if(MainThree.DomElementContainer) {
      this._domElementSet = true;
      this.updateCameraAspect();
    } 
    else {
      MainThree.OnDomElementContainerSet.add(this.setCameraAspectOnInit);
    }

    this.cameraContainer.add(this.camera);
  }

  public setCameraAspectOnInit = (): void => {
    this._domElementSet = true;
    this.updateCameraAspect();
    MainThree.OnDomElementContainerSet.remove(this.updateCameraAspect);
  }

  public updateCameraAspect = (): void => {
    const aspect = MainThree.DomElementContainer.offsetWidth / MainThree.DomElementContainer.offsetHeight;

    this.camera.left = -this.aspectRatio;
    this.camera.right = this.aspectRatio;
    this.camera.top = this.aspectRatio / aspect;
    this.camera.bottom = -this.aspectRatio / aspect;
    
    this.camera.updateProjectionMatrix();
  }

  public onResize = (): void => {
    this.aspectRatio = window.innerWidth / window.innerHeight;

    if(MainThree.DomElementContainer) {
      this.updateCameraAspect();
    }
  }
}