import { TheatersId } from "@constants/TheatersId";
import { ViewId } from "@constants/ViewId";
import { TheaterLayer } from "@core/common/constants/theaters/TheaterLayer";
import { ThreeTheaterBase } from "@core/three/bases/ThreeTheaterBase";
import { CamerasId } from "../constants/CamerasId";

export class MainTheater extends ThreeTheaterBase {
  constructor() {
    super(TheatersId.MAIN, TheaterLayer.MAIN, CamerasId.DUMMY);

    this.viewsList.add(ViewId.THREE_TEST);
  }
}