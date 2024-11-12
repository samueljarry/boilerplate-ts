import { CamerasManager } from "../managers/CamerasManager";
import { MainThree } from "../MainThree";
import { TheaterBase } from "@core/common/bases/theaters/TheaterBase";
import { TheatersId } from "@constants/TheatersId";
import { TheaterLayer } from "@core/common/constants/theaters/TheaterLayer";
import { CamerasId } from "@constants/CamerasId";

export class ThreeTheaterBase extends TheaterBase {
  public cameraId: CamerasId;
  
  constructor(theaterId: TheatersId, theaterLayer: TheaterLayer, cameraId: CamerasId) {
    super(theaterId, theaterLayer);

    this.cameraId = cameraId;

    if (!MainThree.IsInit) {
      MainThree.Init();
    }
  }

  public override init(): void {
    super.init();

    CamerasManager.SetActiveCamera(this.cameraId);
  }

  public override reset(): void {
    super.reset();
  }
}
