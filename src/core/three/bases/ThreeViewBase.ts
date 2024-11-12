import { Mixin } from "ts-mixer";
import { Object3DBase } from "./Object3DBase";
import { Ticker } from "../../common/utils/Ticker";
import { ViewBase } from "../../common/bases/views/ViewBase";
import { ViewId } from "../../../constants/ViewId";
import { ViewLayer } from "../../common/constants/views/ViewLayer";
import { ViewTypes } from "../../common/constants/views/ViewTypes";

export class ThreeViewBase extends Mixin(ViewBase, Object3DBase) {
  constructor(viewId: ViewId, viewLayer: ViewLayer) {
    super(viewId, viewLayer, ViewTypes.THREE);

    this.name = viewId;
  }

  init(): void {
    super.init();

    if(typeof this.update === 'function') {
      Ticker.Add(this.update)
    }
  }

  reset(): void {
    super.reset()

    if(typeof this.update === 'function') {
      Ticker.Remove(this.update)
    }
  }
}