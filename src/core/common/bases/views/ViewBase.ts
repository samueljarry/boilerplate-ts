import { ViewId } from "../../../../constants/ViewId";
import { ViewLayer } from "../../constants/views/ViewLayer";
import { ViewTypes } from "../../constants/views/ViewTypes";

export class ViewBase {
  private _viewId: ViewId;
  private _layer: ViewLayer;
  private _type: ViewTypes;

  constructor(viewId: ViewId, layer: ViewLayer, viewType: ViewTypes) {
    this._viewId = viewId;
    this._layer = layer;
    this._type = viewType;
  }

  public init(): void {
    // 
  }

  public reset(): void {
    // 
  }

  public get viewId(): ViewId { return this._viewId; }
  public get layer(): ViewLayer { return this._layer; }
  public get type(): ViewTypes { return this._type; }
}