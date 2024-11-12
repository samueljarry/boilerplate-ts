import { TheaterLayer } from "@core/common/constants/theaters/TheaterLayer";
import { TheatersId } from "@constants/TheatersId";
import { ViewId } from "@constants/ViewId";

export class TheaterBase {
  public viewsList = new Set<ViewId>();
  public siblingViewsList = new Set<ViewId>();
  public id: TheatersId;
  public layer: TheaterLayer;
  
  constructor(theaterId: TheatersId, theaterLayer: TheaterLayer) {
    this.id = theaterId;
    this.layer = theaterLayer;
  }

  init(): void {
    // 
  }

  reset(): void {
    // 
  }
}