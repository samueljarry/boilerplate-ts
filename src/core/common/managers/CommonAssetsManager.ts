import { Action } from "../utils/Action.js";
import { AssetsId } from "@constants/AssetsId.js";
import { AssetsTypes } from "../constants/AssetsTypes.js";
import { ImageLoader } from "../loaders/ImageLoader.js";
import { SoundLoader } from "../loaders/SoundLoader.js";
import { VideoLoader } from "../loaders/VideoLoader.js";

type AssetToLoad = {
  path: string;
  type: AssetsTypes;
}
const assetToLoad = (path, type): AssetToLoad => ({ path, type });

export class CommonAssetsManager {
  private static _Queue = new Map<AssetsId, AssetToLoad>();
  private static _VideosMap = new Map<AssetsId, HTMLVideoElement>();
  private static _ImagesMap = new Map<AssetsId, HTMLImageElement>();
  private static _SoundsMap = new Map<AssetsId, HTMLAudioElement>();
  public static Loaded = 0;
  public static OnAssetLoaded = new Action();

  public static AddVideo(videoId: AssetsId, videoPath: string): void {
    this._Queue.set(videoId, assetToLoad(videoPath, AssetsTypes.VIDEO));
  }

  public static AddImage(imageId: AssetsId, imagePath: string): void {
    this._Queue.set(imageId, assetToLoad(imagePath, AssetsTypes.IMAGE));
  }

  public static AddSound(soundId: AssetsId, soundPath: string): void {
    this._Queue.set(soundId, assetToLoad(soundPath, AssetsTypes.SOUND));
  }

  public static async Load(): Promise<void> {
    const updateLoadedAssetsCount = () => {
      this.Loaded++;
      this.OnAssetLoaded.execute();
    };

    const promises = Array.from(this._Queue.entries()).map(
      async ([id, { type, path }]) => {
        let asset = undefined;

        switch (type) {
          case AssetsTypes.VIDEO:
            asset = await VideoLoader.Load(path);
            updateLoadedAssetsCount();
            this._VideosMap.set(id, asset);
            break;
          case AssetsTypes.IMAGE:
            asset = await ImageLoader.Load(path);
            updateLoadedAssetsCount();
            this._ImagesMap.set(id, asset);
            break;
          case AssetsTypes.SOUND:
            asset = await SoundLoader.Load(path);
            updateLoadedAssetsCount();
            this._SoundsMap.set(id, asset);
            break;
        }
      }
    );

    await Promise.all(promises);
  }

  public static GetVideo(videoId: AssetsId): HTMLVideoElement {
    return this._VideosMap.get(videoId);
  }

  public static GetImage(imageId: AssetsId): HTMLImageElement {
    return this._ImagesMap.get(imageId);
  }

  public static GetSound(soundId: AssetsId): HTMLAudioElement {
    return this._SoundsMap.get(soundId);
  }
}
