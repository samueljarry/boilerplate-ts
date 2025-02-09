import { AssetsId } from "@constants/AssetsId";
import { CommonAssetsManager } from "./CommonAssetsManager";
import { HTMLProps } from "react";
import { SoundPool } from '../utils/SoundPool';

export class SoundManager {
  private static _SoundPoolMap = new Map<AssetsId, SoundPool>();
  private static _AudioPlayingOnLoopSet = new Map<AssetsId, HTMLAudioElement>();
  
  public static CreateSoundPool(soundId: AssetsId, soundCount = 4): void {
    const pool = new SoundPool(soundId, soundCount);
    this._SoundPoolMap.set(soundId, pool);
  }

  public static Play(soundId: AssetsId): void {
    const sound = this._SoundPoolMap.get(soundId) || CommonAssetsManager.GetSound(soundId);
    sound.play();
  }

  public static PlayLoop(soundId: AssetsId, params: HTMLProps<HTMLAudioElement> = {}): void {
    if (this._AudioPlayingOnLoopSet.has(soundId)) {
      this.StopLoop(soundId);
    }

    const sound = CommonAssetsManager.GetSound(soundId);
    sound.loop = true;
    sound.volume = 0;
    
    sound.play();
    
    this._AudioPlayingOnLoopSet.set(soundId, sound);
  }

  public static StopLoop(soundId: AssetsId): void {
    const sound = this._AudioPlayingOnLoopSet.get(soundId);
    if(!sound) return;
   
    sound.pause();
    sound.currentTime = 0;
    this._AudioPlayingOnLoopSet.delete(soundId);
  }
}