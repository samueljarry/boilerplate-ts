import {
  type Intersection,
  type Camera,
  Mesh,
  Object3D,
  Raycaster,
  Scene,
  Vector2,
} from "three";
import { MainThree } from "../MainThree";
import { DomEvents } from "../../common/constants/DomEvents";
import { InteractionName } from "../constants/InteractionName";
import { Ticker } from "../../common/utils/Ticker";
import { CursorConstants } from "../../common/constants/CursorConstants";
import { DeviceUtils } from "../../common/utils/DeviceUtils";
import { ThreeInteractive } from "../utils/ThreeInteractive";

export class ThreeInteractiveManager {
  private static _InteractivesMap = new Map<Object3D, ThreeInteractive>();
  private static _InteractivesSet = new Set<ThreeInteractive>();
  private static _InteractivesActiveArray = new Array<Object3D>();
  private static _Raycaster = new Raycaster();
  private static _PointerPosition = new Vector2(Infinity, Infinity);
  private static _DomElement: HTMLElement;
  private static _Camera: Camera;
  private static _UnderMouseObjects = new Map<ThreeInteractive, Intersection>();
  private static _DomElementRect: DOMRect;

  private static _LastUpdateUnderMouseObjects = new Map<ThreeInteractive, Intersection>();

  private static _IsEnabled = true;
  private static _TimeBetweenUpdate = 100;
  private static _LastTimeUpdate = 0;
  private static _isMouseDown = false;

  public static Start(dom: HTMLElement): void {
    DeviceUtils.Init();
    this._DomElement = dom;
    this._Resize();
    this._AddCallbacks();
  }

  public static Stop(): void {
    this._RemoveCallbacks();
  }

  public static AddInteractive(interactive: ThreeInteractive): void {
    for (const object of interactive.targets) {
      this._InteractivesMap.set(object as Object3D, interactive);
    }
    this._InteractivesSet.add(interactive);
  }

  public static SetCamera(camera: Camera): void {
    this._Camera = camera;
  }

  public static RemoveInteractive(interactive: ThreeInteractive): void {
    for (const object of interactive.targets) {
      this._InteractivesMap.delete(object as Object3D);
    }
    this._InteractivesSet.delete(interactive);
  }

  private static _OnMouseDown = (e: MouseEvent): void => {
    this._isMouseDown = true;
    this._UpdatePointerPosition(e);
    this._Raycast(InteractionName.MOUSE_DOWN);
    window.addEventListener(DomEvents.MOUSEUP, this._OnMouseUp);
    window.addEventListener(DomEvents.MOUSELEAVE, this._OnMouseUp);
  };

  private static _OnMouseUp = (e: MouseEvent): void => {
    this._isMouseDown = false;
    this._UpdatePointerPosition(e);
    this._Raycast(InteractionName.MOUSE_UP);
    window.removeEventListener(DomEvents.MOUSEUP, this._OnMouseUp);
    window.removeEventListener(DomEvents.MOUSELEAVE, this._OnMouseUp);
  };

  private static _OnMouseMove = (e: MouseEvent): void => {
    this._UpdatePointerPosition(e);
    this._Raycast(InteractionName.MOUSE_MOVE);
  };

  private static _Update = (): void => {
    const delta = Ticker.CurrentTime - this._LastTimeUpdate;
    if (delta < ThreeInteractiveManager._TimeBetweenUpdate) return;
    ThreeInteractiveManager._LastTimeUpdate = Ticker.CurrentTime;
    this._RefreshUnderMouseObjects();
  };

  private static _RefreshUnderMouseObjects(): void {
    this._Raycast();
    for (const [key, value] of this._LastUpdateUnderMouseObjects) {
      if (!this._UnderMouseObjects.has(key)) {
        key.sendInteraction(InteractionName.MOUSE_LEAVE, value);
        this._LastUpdateUnderMouseObjects.delete(key);
      }
    }

    let hasCursor = false;
    for (const [key, value] of this._UnderMouseObjects) {
      key.sendInteraction(InteractionName.MOUSE_ENTER, value);
      if (!hasCursor && !key.passThrough) {
        hasCursor = true;
        this._DomElement.style.cursor = key.cursor;
      }
    }
    if (!hasCursor) {
      this._DomElement.style.cursor = CursorConstants.AUTO;
    }
    this._LastUpdateUnderMouseObjects.clear();
    for (const [key, value] of this._UnderMouseObjects) {
      this._LastUpdateUnderMouseObjects.set(key, value);
    }
    this._UnderMouseObjects.clear();
  }

  private static _Raycast(interactionName: InteractionName = undefined): void {
    if (!this._Camera) return;
    if (!this._IsEnabled) return;
    if (this._InteractivesSet.size === 0) return;

    this._InteractivesActiveArray.length = 0;
    for (let o of this._InteractivesSet) {
      if (!o.isActivate) continue;

      for (const m of o.targets) {
        const mesh = m as Object3D;
        if (!(this._IsInScene(mesh) || o.interactWhenNotInScene)) continue;
        if (!(mesh.visible || o.interactWhenNotVisible)) continue;

        if (!DeviceUtils.IsMobile || this._isMouseDown) {
          this._InteractivesActiveArray.push(mesh);
        }
      }
    }

    this._Raycaster.setFromCamera(this._PointerPosition, this._Camera);
    const intersects = this._Raycaster.intersectObjects(this._InteractivesActiveArray);

    for (let intersect of intersects) {
      if (
        intersect.object instanceof Mesh &&
        this._InteractivesMap.has(intersect.object)
      ) {
        const interactive = this._InteractivesMap.get(intersect.object);
        if (interactive.isActivate) {
          if (
            interactionName === InteractionName.MOUSE_MOVE &&
            !interactive.isMouseEnter
          ) {
            interactive.sendInteraction(InteractionName.MOUSE_ENTER, intersect);
          }
          if (interactionName) {
            interactive.sendInteraction(interactionName, intersect);
          }
          this._UnderMouseObjects.set(interactive, intersect);
          if (!interactive.passThrough) {
            return;
          }
        }
      }
    }
  }

  private static _IsInScene(target: Object3D): boolean {
    let parent = target;
    while (parent.parent) {
      parent = parent.parent;
    }
    return parent instanceof Scene;
  }

  private static _UpdatePointerPosition(e: MouseEvent | TouchEvent): void {
    if (e instanceof TouchEvent && e.touches.length == 0) return;
    const { x, y } = GetMousePosition(e);
    const rx = (x / this._DomElementRect.width) * 2 - 1;
    const ry = -((y / this._DomElementRect.height) * 2 - 1);
    this._PointerPosition.set(rx, ry);
  }

  static _AddCallbacks() {
    this._RemoveCallbacks();
    if (DeviceUtils.IsMobile) {
      this._DomElement.addEventListener(
        DomEvents.TOUCHSTART,
        this._OnMouseDown,
        { passive: true }
      );
      this._DomElement.addEventListener(
        DomEvents.TOUCHMOVE,
        this._OnMouseMove,
        { passive: true }
      );
      this._DomElement.addEventListener(DomEvents.TOUCHEND, this._OnMouseUp, {
        passive: true,
      });
    } else {
      this._DomElement.addEventListener(DomEvents.MOUSEDOWN, this._OnMouseDown);
      this._DomElement.addEventListener(DomEvents.MOUSEUP, this._OnMouseUp);
      this._DomElement.addEventListener(DomEvents.MOUSEMOVE, this._OnMouseMove);
    }

    Ticker.Add(this._Update);
    MainThree.OnResize.add(this._Resize);
    // window.addEventListener(DomEvent.RESIZE, this._Resize);
  }

  private static _RemoveCallbacks(): void {
    this._DomElement.removeEventListener(
      DomEvents.MOUSEDOWN,
      this._OnMouseDown
    );
    this._DomElement.removeEventListener(DomEvents.MOUSEUP, this._OnMouseUp);
    this._DomElement.removeEventListener(
      DomEvents.MOUSEMOVE,
      this._OnMouseMove
    );

    this._DomElement.removeEventListener(
      DomEvents.TOUCHSTART,
      this._OnMouseDown
    );
    this._DomElement.removeEventListener(
      DomEvents.TOUCHMOVE,
      this._OnMouseMove
    );
    this._DomElement.removeEventListener(DomEvents.TOUCHEND, this._OnMouseUp);

    window.removeEventListener(DomEvents.MOUSEUP, this._OnMouseUp);
    window.removeEventListener(DomEvents.MOUSELEAVE, this._OnMouseUp);

    Ticker.Remove(this._Update);
    MainThree.OnResize.remove(this._Resize);
    // window.removeEventListener(DomEvent.RESIZE, this._Resize);
  }

  public static _Resize = () => {
    this._DomElement = MainThree.DomElementContainer;
    this._DomElementRect = this._DomElement.getBoundingClientRect();
  }
}

export const GetMousePosition = (e: MouseEvent | TouchEvent): { x: number, y: number } => {
    let x = 0;
    let y = 0;
    if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
    } else if (e instanceof TouchEvent) {
        if (e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
    }
    return { x: x, y: y };
}
