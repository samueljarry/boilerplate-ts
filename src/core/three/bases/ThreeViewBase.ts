import { MainThree } from "../MainThree";
import { Mixin } from "ts-mixer";
import { Object3D } from "three";
import { Object3DBase } from "./Object3DBase";
import { Ticker } from "../../common/utils/Ticker";
import { ViewBase } from "../../common/bases/views/ViewBase";
import { ViewId } from "@constants/LayoutConstants";
import { ViewLayer } from "../../common/constants/views/ViewLayer";
import { ViewTypes } from "../../common/constants/views/ViewTypes";

export class ThreeViewBase extends Mixin(ViewBase, Object3DBase) {
  private _children: Array<Object3D>;

  constructor(viewId: ViewId, viewLayer: ViewLayer) {
    super(viewId, viewLayer, ViewTypes.THREE);

    this.name = viewId;
  }

  public init(): void {
    super.init();

    this.traverse((child) => {
      if(child instanceof Object3DBase) {
        child.init();
      }
    });

    Ticker.Add(this._update)
  }

  public reset(): void {
    super.reset()

    this.traverse((child) => {
      if(child instanceof Object3DBase) {
        child.reset();
      }
    });

    Ticker.Remove(this._update)
  }

  private _update = (dt: number): void => {
    this.traverse((child) => {
      if(child instanceof Object3DBase) {
        child.update(dt);
      }
    });
  };
}