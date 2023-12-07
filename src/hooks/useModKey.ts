import { useContext, useMemo, useState } from "react";
import { useRefCache } from "./useRefCache";
import useApp, { AppModKeyState, ModKeyContext } from "./useApp";

export default function useModKey() {
  const app = useApp();
  const modKey = useContext(ModKeyContext) || false;
  
  return [modKey, app.modKey.set];
}

export function useModKeyState(): [boolean, AppModKeyState] {
  const [modKey, setModKey] = useState(false);
  const modKeyRef = useRefCache(modKey);
  
  const state = useMemo<AppModKeyState>(() => ({
    set: setModKey,
    toggle: () => setModKey(modKey => !modKey),
    useWatch: () => [useContext(ModKeyContext) || false, setModKey],
    ref: modKeyRef,
  }), [modKeyRef]);
  
  return [modKey, state];
}
