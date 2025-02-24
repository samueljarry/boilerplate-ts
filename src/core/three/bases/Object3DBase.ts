import { DomEvents } from "@core/common/constants/DomEvents";
import { Object3D } from "three";

export abstract class Object3DBase extends Object3D {
  public isExtendedObject3D = true;

  constructor() {
    super();
  }

  public init() {
    if(this.resize) {
      window.addEventListener(DomEvents.RESIZE, this.resize);
    }
  }

  public reset() {
    if(this.resize) {
      window.removeEventListener(DomEvents.RESIZE, this.resize)
    }
  }

  public resize: (e: Event) => void;

  public update(dt: number): void {
    
  };
}
