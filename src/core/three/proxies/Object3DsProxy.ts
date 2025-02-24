import { Object3D } from "three";
import { Object3DIds } from "@core/three/constants/Object3DIds";

export class Object3DsProxy {
  private static _ObjectMap = new Map<Object3DIds, Object3D>();

  public static SetObject3D(id: Object3DIds, object: Object3D): void {
    this._ObjectMap.set(id, object);
  }

  public static GetObject3D<T = Object3D>(id: Object3DIds): T {
    return this._ObjectMap.get(id) as T;
  }

  public static GetObject3DClone<T = Object3D>(id: Object3DIds): T {
    return this._ObjectMap.get(id).clone() as T;
  }
}