import { Action } from "../../common/utils/Action";
import { CameraControllerBase } from "../bases/cameras/CameraControllerBase";
import { CamerasId } from "../../../constants/CamerasId";
import { DomEvents } from "../../common/constants/DomEvents";

export class CamerasManager {
  public static OnCameraChange = new Action();
  public static ActiveCameraId: CamerasId;
  public static ActiveCamera: CameraControllerBase;
  
  private static _CamerasMap = new Map<CamerasId, CameraControllerBase>();
  private static _PreviousCameraId: CamerasId;

  public static Init(): void {
    window.addEventListener(DomEvents.KEYDOWN, this.OnKeyDown);
  }

  public static AddCamera(camera: CameraControllerBase): void {
    this._CamerasMap.set(camera.cameraId, camera);
  }

  public static GetCamera<T extends CameraControllerBase>(cameraId: CamerasId): T {
    return this._CamerasMap.get(cameraId) as T;
  }

  public static SetDomElementContainer(domElement: HTMLElement): void {
    for (const camera of this._CamerasMap.values()) {
      camera.setDomElementContainer(domElement);
    }
  }

  public static SetActiveCamera(cameraId: CamerasId): void {
    if (this.ActiveCamera) {
      this.ActiveCamera.stop();
    }

    this.ActiveCameraId = cameraId;
    this.ActiveCamera = this.GetCamera(this.ActiveCameraId);

    this.ActiveCamera.start();
    this.OnCameraChange.execute(cameraId);
  }

  public static OnKeyDown = ({ code, shiftKey }): void => {
    if (shiftKey && code === "KeyC") {
      this._ToggleDebugCamera();
    }
  };

  private static _ToggleDebugCamera(): void {
    if (this.ActiveCameraId !== CamerasId.DEBUG_CAMERA) {
      this._PreviousCameraId = this.ActiveCameraId;
      this.SetActiveCamera(CamerasId.DEBUG_CAMERA);
    } else {
      this.SetActiveCamera(this._PreviousCameraId);
    }
  }
}