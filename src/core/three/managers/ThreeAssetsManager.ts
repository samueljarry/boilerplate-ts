import { DataTexture, Texture } from 'three';

import { AssetsId } from "@constants/AssetsId.js";
import { AssetsTypes } from "../constants/AssetsTypes.js";
import { GlbLoader } from "../loaders/GlbLoader.js";
import { HdrLoader } from "../loaders/HdrLoader.js";
import { TextureLoader } from "../loaders/TextureLoader.js";

type AssetToLoad = {
  path: string;
  type: AssetsTypes;
}
const assetToLoad = (path: string, type: AssetsTypes): AssetToLoad => ({ path, type })

export class ThreeAssetsManager {
  private static _Queue = new Map();
  static TexturesMap = new Map<AssetsId, Texture>();
  static ModelsMap = new Map<AssetsId, unknown>();
  static HdrMap = new Map<AssetsId, DataTexture>();

  public static AddTexture(textureId: AssetsId, texturePath: string): void {
    this._Queue.set(textureId, assetToLoad(texturePath, AssetsTypes.TEXTURE));
  }

  public static AddGlb(modelId: AssetsId, modelPath: string): void {
    this._Queue.set(modelId, assetToLoad(modelPath, AssetsTypes.GLB));
  }

  public static AddHdr(hdrId: AssetsId, hdrPath: string): void {
    this._Queue.set(hdrId, assetToLoad(hdrPath, AssetsTypes.HDR));
  }

  public static async Load(): Promise<void> {
    const promises = Array.from(this._Queue.entries()).map(
      async ([id, { type, path }]) => {
        let asset = undefined;

        switch (type) {
          case AssetsTypes.TEXTURE:
            asset = await TextureLoader.Load(path);
            this.TexturesMap.set(id, asset);
            break;
          case AssetsTypes.GLB:
            asset = await GlbLoader.Load(path);
            this.ModelsMap.set(id, asset);
            break;
          case AssetsTypes.HDR:
            asset = await HdrLoader.Load(path);
            this.HdrMap.set(id, asset);
            break;
        }
      }
    );

    await Promise.all(promises);
  }

  public static GetTexture(textureId: AssetsId): Texture {
    return this.TexturesMap.get(textureId);
  }

  public static GetModel<T>(modelId: AssetsId): T {
    return this.ModelsMap.get(modelId) as T;
  }

  public static GetHdr(hdrId: AssetsId): DataTexture {
    return this.HdrMap.get(hdrId);
  }
}