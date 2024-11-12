import { TheaterBase } from '../bases/theaters/TheaterBase';
import { TheaterLayer } from '../constants/theaters/TheaterLayer';
import { TheatersId } from '../../../constants/TheatersId';
import { ViewsManager } from "@core/common/managers/ViewsManager";

export class TheatersManager {
  private static _TheatersMap = new Map<TheatersId, TheaterBase>();
  private static _TheatersLayerMap = new Map<TheaterLayer, TheaterBase>();
  private static _DisplayedTheatersSet = new Set<TheatersId>();

  public static Init(): void {
    this._TheatersMap.clear();
    this._TheatersLayerMap.clear();
    this._DisplayedTheatersSet.clear();
  }

  public static AddTheater(theater: TheaterBase): void {
    this._TheatersMap.set(theater.id, theater)
  }

  public static RemoveTheater(theaterId: TheatersId): void {
    this._TheatersMap.delete(theaterId)
  }

  public static GetTheater(theaterId: TheatersId): TheaterBase {
    return this._TheatersMap.get(theaterId)
  }

  public static Show(theaterId: TheatersId): void {
    const theater = this._TheatersMap.get(theaterId);
    if(!theater) {
      throw new Error(`Theater with id "${theaterId}" not declared in TheatersMap`)
    }

    const prevTheater = this._TheatersLayerMap.get(theater.layer);


    if(prevTheater) {
      this.Hide(prevTheater.id);
    }

    theater.init();
    for(const viewId of theater.viewsList.values()) {
      ViewsManager.Show(viewId);
    }

    this._DisplayedTheatersSet.add(theaterId);
    this._TheatersLayerMap.set(theater.layer, theater)
  }

  public static Hide(theaterId: TheatersId): void {
    const theater = this._TheatersMap.get(theaterId);

    theater.reset();

    for(const viewId of theater.viewsList) {
      ViewsManager.Hide(viewId);
    }

    for(const viewId of theater.siblingViewsList) {
      ViewsManager.Hide(viewId);
    }

    this._DisplayedTheatersSet.delete(theaterId);
  }
}