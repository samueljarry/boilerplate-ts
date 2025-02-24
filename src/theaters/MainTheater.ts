import { AssetsId } from "@constants/AssetsId";
import { CamerasId } from "../constants/CamerasId";
import { TheaterLayer } from "@core/common/constants/theaters/TheaterLayer";
import { TheatersId } from "@constants/LayoutConstants";
import { ThreeTheaterBase } from "@core/three/bases/ThreeTheaterBase";
import { ViewId } from "@constants/LayoutConstants";

export class MainTheater extends ThreeTheaterBase {
  constructor() {
    super(TheatersId.MAIN, TheaterLayer.MAIN, CamerasId.DEFAULT_CAMERA, AssetsId.HDR_SKY);

    this.viewsList.add(ViewId.THREE_TEST);
  }
}