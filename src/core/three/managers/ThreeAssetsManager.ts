import { CubeTexture, DataTexture, Scene, SkinnedMesh, Texture } from 'three';
import { GLTF, GlbLoader } from "../loaders/GlbLoader.js";

import { AssetsId } from "@constants/AssetsId.js";
import { AssetsTypes } from "../constants/AssetsTypes.js";
import { CubemapLoader } from '../loaders/CubemapLoader.js';
import { HdrLoader } from "../loaders/HdrLoader.js";
import { TextureLoader } from "../loaders/TextureLoader.js";

type AssetToLoad = {
  path: string;
  type: AssetsTypes;
}
const assetToLoad = (path: string, type: AssetsTypes): AssetToLoad => ({ path, type })

export class ThreeAssetsManager {
  private static _Queue = new Map();
  private static _TexturesMap = new Map<AssetsId, Texture>();
  private static _ModelsMap = new Map<AssetsId, GLTF>();
  private static _HdrMap = new Map<AssetsId, DataTexture>();
  private static _CubeTexturesMap = new Map<AssetsId, CubeTexture>();

  public static AddTexture(textureId: AssetsId, texturePath: string): void {
    this._Queue.set(textureId, assetToLoad(texturePath, AssetsTypes.TEXTURE));
  }

  public static AddGlb(modelId: AssetsId, modelPath: string): void {
    this._Queue.set(modelId, assetToLoad(modelPath, AssetsTypes.GLB));
  }

  public static AddHdr(hdrId: AssetsId, hdrPath: string): void {
    this._Queue.set(hdrId, assetToLoad(hdrPath, AssetsTypes.HDR));
  }

  public static AddCubeTexture(assetId: AssetsId, folderPath: string): void {
    this._Queue.set(assetId, assetToLoad(folderPath, AssetsTypes.CUBEMAP));
  }

  public static async Load(): Promise<void> {
    const promises = Array.from(this._Queue.entries()).map(
      async ([id, { type, path }]) => {
        let asset = undefined;

        switch (type) {
          case AssetsTypes.TEXTURE:
            asset = await TextureLoader.Load(path);
            this._TexturesMap.set(id, asset);
            break;
          case AssetsTypes.GLB:
            asset = await GlbLoader.Load(path);
            this._ModelsMap.set(id, asset);
            break;
          case AssetsTypes.HDR:
            asset = await HdrLoader.Load(path);
            this._HdrMap.set(id, asset);
            break;
          case AssetsTypes.CUBEMAP:
            asset = await CubemapLoader.Load(path);
            this._CubeTexturesMap.set(id, asset);
            break;
        }
      }
    );

    await Promise.all(promises);
  }

  public static GetTexture(textureId: AssetsId): Texture {
    return this._TexturesMap.get(textureId);
  }

  public static GetModel(modelId: AssetsId): GLTF {
    return this._ModelsMap.get(modelId);
  }

  public static GetCubeTexture(cubeTextureId: AssetsId): CubeTexture {
    return this._CubeTexturesMap.get(cubeTextureId);
  }

  public static GetModelClone(modelId: AssetsId): GLTF {
    const originalGLB = this.GetModel(modelId);

    const glb = {
      ...originalGLB,
      scene: originalGLB.scene.clone()
    }

    if (originalGLB.animations) {
      glb.animations = glb.animations.map(anim => anim.clone());
    }

    const originalSkinnedMeshes = new Map();
    originalGLB.scene.traverse((node) => {
      if(!(node instanceof SkinnedMesh)) return;

      originalSkinnedMeshes.set(node.name, node);
    });

    glb.scene.traverse((node) => {
      if(!(node instanceof SkinnedMesh)) return;
      
      const originalMesh = originalSkinnedMeshes.get(node.name);
      if (originalMesh) {
        (node as any).skeleton = originalMesh.skeleton.clone();
        (node as any).skeleton.bones = originalMesh.skeleton.bones.map(bone => {
          const clonedBone = glb.scene.getObjectByName(bone.name);
          return clonedBone || bone;
        });
        (node as any).skeleton.boneInverses = originalMesh.skeleton.boneInverses.map(inverse => inverse.clone());
      }
    });


    return glb;
  }

  public static GetHdr(hdrId: AssetsId): DataTexture {
    return this._HdrMap.get(hdrId);
  }
}