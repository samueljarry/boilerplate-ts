import { Intersection, Mesh, Object3D } from "three";

import { Action } from "@core/common/utils/Action";
import { InteractionName } from "../constants/InteractionName";
import { ThreeInteractiveManager } from "../managers/ThreeInteractiveManager";

export class ThreeInteractive {
  private _targets = new Array<Object3D>();
  private _isActivate = false;
  private _isMouseEnter = false;
  private _isMouseDown = false;
  private _touchStartTime: number;
  private _maxDelay = 500;

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
        this._targets.push(child);
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

  public sendInteraction = (name: InteractionName, { intersection, event }: { intersection: Intersection; event?: Event }): void => {
    let isClick = false;

    switch(name) {
      case InteractionName.MOUSE_ENTER:
        if (this._isMouseEnter) return;
        this._isMouseEnter = true;
        break;
      case InteractionName.MOUSE_LEAVE:
        if (!this._isMouseEnter) return;
        this._isMouseEnter = false;
        break;
      case InteractionName.MOUSE_DOWN:
        this._isMouseDown = true;
        this._touchStartTime = new Date().getTime();
        break;
      case InteractionName.MOUSE_UP:
        const now = new Date().getTime();
        isClick = this._isMouseDown && now - this._touchStartTime < this._maxDelay;
        this._isMouseDown = false;
        break;
    }

    this._sendInteraction(name, { intersection, event });
    if (isClick) this._sendInteraction(InteractionName.CLICK, { intersection, event });
  }

  private _sendInteraction(name: InteractionName, { intersection, event = null }: { intersection: Intersection; event?: Event }): void {
    if (this.onInteraction) {
      this.onInteraction.execute(name, { intersection, event });
    }
  }

  public get targets(): Array<Object3D> { return this._targets; }
  public get isActivate(): boolean { return this._isActivate; }
  public get isMouseEnter(): boolean { return this._isMouseEnter; }
}