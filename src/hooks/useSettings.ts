import React, { useCallback, useContext, useMemo } from "react";
import { DeepPartial, Flatten, SetState } from "../utils/types";
import useLocalStorage from "./useLocalStorage";
import { useRefCache } from "./useRefCache";
import useApp, { AppSettingsState, SettingsContext } from "./useApp";

export enum KeyAction {
  GLYPH_MOD = "glyphMod",
  RUN = "run",
  SAVE = "save",
  OPEN = "open",
  OPEN_INPUT = "openInput",
  COMMENT_LINE = "commentLine",
  FOLD_OUTPUTS = "foldOutputs",
}

export interface KeyBind {
  key: string;
  code?: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export interface Settings {
  glyphs: {
    show: boolean;
    modToggle: boolean;
    modHighlight: boolean;
    modHints: boolean;
    showExtra: boolean;
  };
  output: {
    show: boolean;
    persist: boolean;
    wrap: boolean;
    multimedia: boolean;
  };
  keyBinds: Record<KeyAction, KeyBind | null>;
}

const defaultSettings: Settings = {
  glyphs: {
    show: true,
    modToggle: false,
    modHighlight: false,
    modHints: true,
    showExtra: false,
  },
  output: {
    show: true,
    persist: false,
    wrap: false,
    multimedia: true,
  },
  keyBinds: {
    /* eslint-disable key-spacing */
    [KeyAction.GLYPH_MOD]:    { key: "\\" },
    [KeyAction.RUN]:         { key: "Enter", shift: true },
    [KeyAction.SAVE]:        { key: "s", ctrl: true },
    [KeyAction.OPEN]:        { key: "o", ctrl: true },
    [KeyAction.OPEN_INPUT]:   { key: "i", ctrl: true },
    [KeyAction.COMMENT_LINE]: { key: "/", ctrl: true },
    [KeyAction.FOLD_OUTPUTS]: { key: "Escape" },
    /* eslint-enable key-spacing */
  },
};

export type FlattenedSettings = Flatten<Settings>;
export type SettingsPaths = undefined | keyof FlattenedSettings;
export type SettingsQuery<Path extends SettingsPaths> = Path extends keyof FlattenedSettings ? FlattenedSettings[Path] : Settings;
export type SetSettings = <Path extends SettingsPaths>(path: Path, action: React.SetStateAction<SettingsQuery<Path>>) => void;
export type WatchSettings = <Path extends SettingsPaths = undefined, Value = SettingsQuery<Path>>(path: Path) => [Value, SetState<Value>];

export default function useSettings<Path extends SettingsPaths = undefined, Value = SettingsQuery<Path>>(path?: Path): [Value, SetState<Value>] {
  const app = useApp();
  
  return useSettingsImpl(app.settings.set, path);
}

function useSettingsImpl<Path extends SettingsPaths = undefined, Value = SettingsQuery<Path>>(set: SetSettings, path?: Path): [Value, SetState<Value>] {
  const settings = useContext(SettingsContext);
  if(!settings) throw new Error("useSettings can't be used outside of SettingsContext");
  
  const parts = useMemo(() => path?.split(".") || [], [path]);
  
  const setValue = useCallback<SetState<Value>>(action => set(path, action as any), [path, set]);
  
  let value: any = settings;
  for(const part of parts) {
    if(part in value) {
      value = value[part];
    } else {
      value = undefined;
      break;
    }
  }
  
  return [value, setValue];
}

export function useSettingsState(): [Settings, AppSettingsState] {
  const [settings, saveSettings] = useLocalStorage<DeepPartial<Settings>>("settings", {});
  
  const set = useCallback<SetSettings>((path, action) => {
    saveSettings(settings => {
      type Value = SettingsQuery<typeof path>;
      
      const merged = mergeSettings(defaultSettings, settings);
      
      const parts = path?.split(".") || [];
      const fnAction = (value: Value): Value => typeof action === "function" ? action(value) : action;
      if(parts.length === 0) return fnAction(merged as Value) as Settings;
      
      const newSettings = { ...settings };
      let cursor: any = newSettings;
      let mergedCursor: any = merged;
      const key = parts[parts.length - 1];
      
      for(const part of parts.slice(0, -1)) {
        cursor = cursor[part] = {
          ...cursor[part],
        };
        mergedCursor = mergedCursor[part];
      }
      
      cursor[key] = fnAction(mergedCursor[key]);
      
      return newSettings;
    });
  }, [saveSettings]);
  
  const mergedSettings = useMemo(() => mergeSettings(defaultSettings, settings), [settings]);
  const mergedRef = useRefCache(mergedSettings);
  
  const state = useMemo<AppSettingsState>(() => ({
    set,
    reset: () => set(undefined, {} as Settings),
    useWatch: (path: SettingsPaths) => useSettingsImpl(set, path),
    ref: mergedRef,
  }), [mergedRef, set]);
  
  return [mergedSettings, state];
}

function mergeSettings<T>(target: T, patch: DeepPartial<T>): T {
  const targetPlain = target?.constructor === Object;
  const patchPlain = patch?.constructor === Object;
  
  if(targetPlain && patchPlain) {
    const newTarget = { ...target };
    
    for(const key in patch) {
      newTarget[key as keyof T] = mergeSettings(target[key as keyof T], patch[key] as any);
    }
    
    return newTarget;
  } else {
    return patch as T;
  }
}

