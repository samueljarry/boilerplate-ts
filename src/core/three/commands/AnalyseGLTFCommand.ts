import { AssetsId } from "@constants/AssetsId";
import { GLTF } from "@core/three/loaders/GlbLoader";
import { Object3DIds } from "@core/three/constants/Object3DIds";
import { Object3DsProxy } from "@core/three/proxies/Object3DsProxy";
import { ThreeAnimationsId } from "@core/three/constants/ThreeAnimationsId";
import { ThreeAnimationsProxy } from "@core/three/proxies/ThreeAnimationsProxy";
import { ThreeAssetsManager } from "@core/three/managers/ThreeAssetsManager";

export class AnalyseGLTFCommand {
  public static Analyse(glbId: AssetsId): void {
    const glb = ThreeAssetsManager.GetModel(glbId);

    this._AnalyseAnimations(glb);
    this._AnalyseScene(glb);
  }

  private static _AnalyseAnimations(glb: GLTF): void {
    const animationsId = Object.values(ThreeAnimationsId);

    for(const animationClip of glb.animations) {
      for(const id of animationsId) {
        if(id === animationClip.name) {
          ThreeAnimationsProxy.SetAnimationClip(id as unknown as ThreeAnimationsId, animationClip);
        }
      }  
    }
  }

  private static _AnalyseScene(glb: GLTF): void {
    glb.scene.traverse((child) => {
      for(const id of Object.values(Object3DIds)) {
        if(!child.isObject3D) continue;
        if(child.name === id) {
          Object3DsProxy.SetObject3D(id, child);
        }
      }
    })
  }
}