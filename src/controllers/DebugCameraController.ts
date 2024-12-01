import { MainThree } from "@core/three/MainThree";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CamerasId } from "../constants/CamerasId";
import { PerspectiveCameraControllerBase } from "../core/three/bases/cameras/PerspectiveCameraControllerBase";

export class DebugCameraController extends PerspectiveCameraControllerBase {
  public isOrbitCamera = true;
  public orbit: OrbitControls;
  
  constructor() {
    super(CamerasId.DEBUG_CAMERA);

    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(new Vector3(0, 0, 0));  
  }

  start() {
    super.start()
    this.setDomElementContainer();
    this.orbit.enabled = true;
  }  

  stop() {
    super.stop()
    this.orbit.enabled = false;
  }

  setDomElementContainer(domElementContainer: HTMLElement = MainThree.DomElementContainer): void {
    super.setDomElementContainer(domElementContainer);
    
    this.orbit = new OrbitControls(this.camera, this._domElementContainer);
    this.orbit.update()
  }
}