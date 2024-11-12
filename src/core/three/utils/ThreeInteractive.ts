import { Intersection, Mesh, Object3D } from "three";

import { Action } from "@core/common/utils/Action";
import { InteractionName } from "../constants/InteractionName";
import { ThreeInteractiveManager } from "../managers/ThreeInteractiveManager";

export class ThreeInteractive {
  private _targets = new Array<Object3D>();
  private _isActivate = false;
  private _isMouseEnter = false;
  private _isMouseDown = false;

  public onInteraction = new Action();
  public interactWhenNotVisible = false;
  public interactWhenNotInScene = false;
  public passThrough = false;
  
  constructor(target: Object3D) {
    this.activate();
    if (target) {
        this.setTarget(target);
    }
  }

  public setTarget(target: Object3D): void {
    ThreeInteractiveManager.RemoveInteractive(this);
    this._targets.length = 0;
    this.addTarget(target);
  }

  public addTarget(target: Object3D): void {
    target.traverse((child) => {
      if (child instanceof Mesh) {
        this._targets.add(child);
      }
    });
    ThreeInteractiveManager.AddInteractive(this);
  }

  public activate(): void {
    this._isActivate = true;
  }

  public desactivate(): void {
    this._isActivate = false;
  }

  public sendInteraction = (name: InteractionName, intersect: Intersection): void => {
    let isClick = false;
    if (name == InteractionName.MOUSE_ENTER) {
      if (this._isMouseEnter) return;
      this._isMouseEnter = true;
    }
    if (name == InteractionName.MOUSE_LEAVE) {
      if (!this._isMouseEnter) return;
      this._isMouseEnter = false;
    }

    if (name == InteractionName.MOUSE_DOWN) this._isMouseDown = true;
    if (name == InteractionName.MOUSE_UP) {
      if (this._isMouseDown) isClick = true;
      this._isMouseDown = false;
    }
    this._sendInteraction(name, intersect);
    if (isClick) this._sendInteraction(InteractionName.CLICK, intersect);
  }

  private _sendInteraction(name: InteractionName, intersect: Intersection): void {
    if (this.onInteraction) {
      this.onInteraction.execute(name, intersect);
    }
  }

  public get targets(): Array<Object3D> { return this._targets; }
  public get isActivate(): boolean { return this._isActivate; }
  public get isMouseEnter(): boolean { return this._isMouseEnter; }
}