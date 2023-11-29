import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRefCache } from "./useRefCache";

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const debouncedRef = useRef(false);
  const [value, setValue] = useState(defaultValue);
  const valueRef = useRefCache(value);
  
  const onChange = useCallback((action: React.SetStateAction<T>) => {
    setValue(action);
    
    if(!debouncedRef.current) {
      debouncedRef.current = true;
      setTimeout(() => {
        debouncedRef.current = false;
        localStorage.setItem(key, JSON.stringify(valueRef.current));
      }, 500);
    }
  }, [key, valueRef]);
  
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if(!saved) return;
    try {
      setValue(JSON.parse(saved));
    } catch(err) {
      console.error(err);
    }
  }, [key]);
  
  return [value, onChange] as const;
}
