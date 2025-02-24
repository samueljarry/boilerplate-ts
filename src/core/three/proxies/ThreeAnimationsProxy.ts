import { AnimationClip } from "three";
import { ThreeAnimationsId } from "@core/three/constants/ThreeAnimationsId";

export class ThreeAnimationsProxy {
  private static _AnimationsMap = new Map<ThreeAnimationsId, AnimationClip>();

  public static SetAnimationClip(id: ThreeAnimationsId, clip: AnimationClip): void {
    this._AnimationsMap.set(id, clip);
  }

  public static GetAnimationClip(animationId: ThreeAnimationsId): AnimationClip {
    return this._AnimationsMap.get(animationId);
  }
}