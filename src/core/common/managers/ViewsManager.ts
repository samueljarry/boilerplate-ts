import { Action } from "@core/common/utils/Action";
import { ReactViewBase } from "../bases/views/react/ReactViewBase";
import { ThreeViewBase } from "../../three/bases/ThreeViewBase";
import { ViewBase } from '../bases/views/ViewBase';
import { ViewId } from "../../../constants/ViewId";
import { ViewLayer } from '../constants/views/ViewLayer';

export class ViewsManager {
  public static OnViewsChange = new Action();

  private static _DisplayedViewsSet = new Set<ViewBase>();
  private static _LayerViewsMap = new Map<ViewLayer, ViewBase>();
  private static _ViewsMap = new Map<ViewId, ViewBase>();

  public static AddReactView(viewId: ViewId, viewLayer: ViewLayer, view: (props: unknown) => JSX.Element): void {
    this._ViewsMap.set(viewId, new ReactViewBase(viewId, viewLayer, view));
  }

  public static AddThreeView(viewBase: new () => ThreeViewBase): void {
    const view = new viewBase();
    this._ViewsMap.set(view.viewId, view)
  }

  public static RemoveView(viewId: ViewId): void {
    this._ViewsMap.delete(viewId);
  }

  public static Show(viewId: ViewId): void {
    let view = this._ViewsMap.get(viewId);

    const prevView = this._LayerViewsMap.get(view?.layer);

    if(prevView && prevView.viewId) {
      this.Hide(prevView.viewId);
    }

    view.init();
    this._LayerViewsMap.set(view.layer, view);
    this._DisplayedViewsSet.add(view);
    this.OnViewsChange.execute();
  }

  public static Hide(viewId: ViewId): void {
    const view = this.GetView(viewId);
    view.reset();
    
    this._LayerViewsMap.delete(view.layer);
    this._DisplayedViewsSet.delete(this._ViewsMap.get(viewId));
    this.OnViewsChange.execute();
  }

  public static GetView<T extends ViewBase>(viewId: ViewId): T {
    return this._ViewsMap.get(viewId) as T;
  }

  public static GetDisplayedViews() {
    return new Set(this._DisplayedViewsSet)
  }
}