import { ViewId } from "../../../../constants/ViewId";
import { ViewLayer } from "../../constants/views/ViewLayer";
import { ViewTypes } from "../../constants/views/ViewTypes";

export class ViewBase {
  public viewId: ViewId;
  public layer: ViewLayer;
  public type: ViewTypes;

  constructor(viewId: ViewId, layer: ViewLayer, viewType: ViewTypes) {
    this.viewId = viewId;
    this.layer = layer;
    this.type = viewType;
  }

  init(): void {
    // 
  }

  reset(): void {
    // 
  }
}