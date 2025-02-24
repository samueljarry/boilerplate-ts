import { ViewBase } from "../ViewBase";
import { ViewId } from "@constants/LayoutConstants";
import { ViewLayer } from "../../../constants/views/ViewLayer";
import { ViewTypes } from "../../../constants/views/ViewTypes";

export class ReactViewBase extends ViewBase {
  private _props = {};
  public component: (props: unknown) => JSX.Element;
  public htmlElement: HTMLElement;

  constructor(viewId: ViewId, viewLayer: ViewLayer, viewComponent: (props: unknown) => JSX.Element) {
    super(viewId, viewLayer, ViewTypes.REACT);

    this.component = viewComponent;
    
    this._props = {
      viewId
    }
  }

  public setHtmlElement(htmlElement: HTMLElement): void {
    this.htmlElement = htmlElement
    
    if(this.layer > -1) {
      this.htmlElement.style.zIndex = this.layer.toString();
    }
  }
}