export class SoundLoader {
  public static async Load(path: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.addEventListener("canplaythrough", () => {
        resolve(audio);
      });

      audio.addEventListener("error", (error) => {
        reject(new Error(`Error loading sound: ${error}`));
      });

      audio.src = path;
      audio.load();
    });
  }
}
