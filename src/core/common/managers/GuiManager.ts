import * as TweakpaneEssentials from '@tweakpane/plugin-essentials';

import { Bindable, BindingApi, BindingParams, ButtonApi, FolderApi, TabApi } from "@tweakpane/core";
import { ListBladeApi, Pane } from "tweakpane";

import { DomEvents } from '@core/common/constants/DomEvents';

export type ListArrayParams = {
  text: string;
  value: unknown;
}

export class GuiManager {
  private static _Pane: Pane;

  public static Init(): void {
    this._Pane = new Pane();
    this._Pane.hidden = true;

    this._Pane.registerPlugin(TweakpaneEssentials);
    window.addEventListener(DomEvents.KEYDOWN, this._OnKeydown);
  }

  private static _OnKeydown = ({ code, shiftKey }: KeyboardEvent) => {
    if (shiftKey && code === "KeyP") {
      this._Pane.hidden = !this._Pane.hidden;
    }
  };

  public static Show(): void {
    this._Pane.hidden = false;
  }

  public static Hide(): void {
    this._Pane.hidden = false;
  }

  public static Add<T>(
    object: Bindable,
    key: string,
    opt_params?: BindingParams
  ): BindingApi<T> {
    return this._Pane.addBinding(object, key, opt_params) as BindingApi<T>;
  }

  public static AddFolder(title: string = "", expanded = false): FolderApi {
    return this._Pane.addFolder({ title, expanded });
  }

  public static AddButton(
    title: string = "",
    label: string = "button"
  ): ButtonApi {
    return this._Pane.addButton({ title, label });
  }

  public static AddTabs(tabs: Array<string>): TabApi {
    return this._Pane.addTab({
      pages: tabs.map((tab) => ({ title: tab })),
    });
  }

  public static AddList<T>(
    label: string,
    list: Array<ListArrayParams> | Array<T>,
    defaultValue: T = null
  ): ListBladeApi<T> {
    const isFormatted = !!(list[0] as ListArrayParams).text;
    const params = {
      view: "list",
      label,
      value: defaultValue,
    };

    if(isFormatted) {
      return this._Pane.addBlade({
        ...params,
        options: list,
      }) as ListBladeApi<T>;
    }

    return this._Pane.addBlade({
      ...params,
      options: list.map((value: unknown) => ({
        text: value.toString(),
        value,
      })),
    }) as ListBladeApi<T>;
  }

  public static AddShaderColor(
    object: Bindable,
    key: string,
    opt_params?: BindingParams
  ): BindingApi {
    return this._Pane.addBinding(object, key, {
      color: {
        type: "float",
      },
      ...opt_params,
    });
  }
}