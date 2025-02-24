import { CamerasManager } from "../managers/CamerasManager";
import { MainThree } from "../MainThree";
import { TheaterBase } from "@core/common/bases/theaters/TheaterBase";
import { TheatersId } from "@constants/LayoutConstants";
import { TheaterLayer } from "@core/common/constants/theaters/TheaterLayer";
import { CamerasId } from "@constants/CamerasId";
import { AssetsId } from "@constants/AssetsId";

export class ThreeTheaterBase extends TheaterBase {
  private _cameraId: CamerasId;
  private _hdrId: AssetsId
  
  constructor(theaterId: TheatersId, theaterLayer: TheaterLayer, cameraId: CamerasId, hdrId: AssetsId) {
    super(theaterId, theaterLayer);

    this._cameraId = cameraId;
    this._hdrId = hdrId;

    if (!MainThree.IsInit) {
      MainThree.Init();
    }
  }

  public override init(): void {
    super.init();

    CamerasManager.SetActiveCamera(this._cameraId);
    MainThree.SetHdr(this._hdrId);
  }

  public override reset(): void {
    super.reset();
  }

  public get cameraId(): CamerasId { return this._cameraId; }
  public get hdrId(): AssetsId { return this._hdrId; }
}
