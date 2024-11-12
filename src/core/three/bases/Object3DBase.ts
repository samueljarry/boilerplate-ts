import { Object3D } from "three";

export class Object3DBase extends Object3D {
  public isExtendedObject3D = true;

  constructor() {
    super();
  }

  init() {
    for (const child of this.children) {
      if (child instanceof Object3DBase) {
        child.init();
      }
    }
  }

  reset() {
    for (const child of this.children) {
      if (child instanceof Object3DBase) {
        child.reset();
      }
    }
  }

  update = (dt: number): void => {
    for (const child of this.children) {
      if (child instanceof Object3DBase) {
        child.update(dt);
      }
    }
  };
}
