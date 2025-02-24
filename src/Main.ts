import { TheatersId, ViewId } from "./constants/LayoutConstants";

import { Action } from "./core/common/utils/Action";
import { InitCommand } from "./commands/InitCommand";
import { TheatersManager } from "./core/common/managers/TheatersManager";
import { Ticker } from "./core/common/utils/Ticker";
import { ViewsManager } from "@core/common/managers/ViewsManager";

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
    ViewsManager.Show(ViewId.MAIN_THREE);
    TheatersManager.Show(TheatersId.MAIN);
  }
}