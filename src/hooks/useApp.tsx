import React, { useContext, useMemo } from "react";
import { ImmutableRef, SetState } from "../utils/types";
import { useCodeState } from "./useCode";
import { Settings, SetSettings, WatchSettings, useSettingsState } from "./useSettings";
import { InputFile, useInputState } from "./useInput";
import { BQNOutput, useOutputState } from "./useOutput";
import { useModKeyState } from "./useModKey";

export interface AppContextState {
  code: {
    insert: (text: string, paren?: string) => void;
    set: (text: string, preserveHistory?: boolean) => void;
    run: () => void;
    save: () => void;
    open: () => void;
    indentLine: (back?: boolean) => void;
    commentLine: () => void;
    useWatch: () => string;
    ref: ImmutableRef<string>;
    inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  };
  input: {
    set: SetState<InputFile | null>;
    save: () => void;
    open: () => void;
    close: () => void;
    useWatch: () => InputFile | null;
    ref: ImmutableRef<InputFile | null>;
    inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  };
  output: {
    append: (output: BQNOutput) => void;
    clear: () => void;
    useWatch: () => BQNOutput[];
    ref: ImmutableRef<BQNOutput[]>;
  };
  settings: {
    set: SetSettings;
    reset: () => void;
    useWatch: WatchSettings;
    ref: ImmutableRef<Settings>;
  };
  modKey: {
    set: SetState<boolean>;
    toggle: () => void;
    useWatch: () => [boolean, SetState<boolean>];
    ref: ImmutableRef<boolean>;
  };
}

export type AppCodeState = AppContextState["code"];
export type AppInputState = AppContextState["input"];
export type AppOutputState = AppContextState["output"];
export type AppSettingsState = AppContextState["settings"];
export type AppModKeyState = AppContextState["modKey"];

export const AppContext = React.createContext<AppContextState | null>(null);
export const CodeContext = React.createContext<string | null>(null);
export const InputContext = React.createContext<InputFile | null>(null);
export const OutputContext = React.createContext<BQNOutput[] | null>(null);
export const SettingsContext = React.createContext<Settings | null>(null);
export const ModKeyContext = React.createContext<boolean | null>(null);

export function useAppState(): Omit<AppProvidersProps, "children"> {
  const [settings, settingsState] = useSettingsState();
  const [input, inputState] = useInputState();
  const [output, outputState] = useOutputState();
  const [code, codeState] = useCodeState(inputState, outputState, settingsState);
  const [modKey, modKeyState] = useModKeyState();
  
  return useMemo(() => ({
    app: { code: codeState, input: inputState, output: outputState, settings: settingsState, modKey: modKeyState },
    code,
    input,
    output,
    settings,
    modKey,
  }), [code, codeState, input, inputState, output, outputState, settings, settingsState, modKey, modKeyState]);
}

interface AppProvidersProps {
  app: AppContextState;
  code: string;
  input: InputFile | null;
  output: BQNOutput[];
  settings: Settings;
  modKey: boolean;
  children: React.ReactNode;
}

export function AppProviders({ app, code, input, output, settings, modKey, children }: AppProvidersProps) {
  return (
    <AppContext.Provider value={app}>
      <SettingsContext.Provider value={settings}>
        <InputContext.Provider value={input}>
          <OutputContext.Provider value={output}>
            <CodeContext.Provider value={code}>
              <ModKeyContext.Provider value={modKey}>
                {children}
              </ModKeyContext.Provider>
            </CodeContext.Provider>
          </OutputContext.Provider>
        </InputContext.Provider>
      </SettingsContext.Provider>
    </AppContext.Provider>
  );
}

export default function useApp() {
  const context = useContext(AppContext);
  if(!context) throw new Error("Can't use useApp outside of AppContext");
  return context;
}
