import { Action } from "./core/common/utils/Action";
import { InitCommand } from "./commands/InitCommand";
import { TheatersId } from "./constants/TheatersId";
import { TheatersManager } from "./core/common/managers/TheatersManager";
import { Ticker } from "./core/common/utils/Ticker";

export class Main {
  public static IsInit = false;
  public static OnInit = new Action();

  public static async Init() {
    const inits = [
      new InitCommand(),
    ]

    const promises = inits.map(async (initCommand) => {
      await initCommand.init();
    });

    await Promise.all(promises);
    
    this.IsInit = true;
    this.OnInit.execute();
  }

  public static Start() {
    Ticker.Start();
    TheatersManager.Show(TheatersId.MAIN);
  }
}