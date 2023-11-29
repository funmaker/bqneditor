import React, { useCallback, useContext, useMemo, useRef } from "react";
import { useRefCache } from "../utils/useRefCache";
import { InputFile } from "../app/App";
import bqn from "./bqn";
import { BQNOutput, parseOutput } from "./output";

console.log(bqn);

interface BQNContextState {
  insert: (text: string, paren?: string) => void;
  run: () => void;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  codeRef: React.RefObject<string>;
  setCode: (code: string) => void;
  inputFileRef: React.RefObject<InputFile>;
  setInputFile: (inputFile: InputFile | null) => void;
}

const BQNContext = React.createContext<BQNContextState | null>(null);

export default function useBQN() {
  const context = useContext(BQNContext);
  if(!context) throw new Error("Can't use useBQN() outside of BQN context.");
  
  return context;
}

interface BQNProviderProps {
  code: string;
  setCode: (code: string) => void;
  inputFile: InputFile | null;
  setInputFile: (fileInput: InputFile | null) => void;
  onRun: () => void;
  onOutput: (output: BQNOutput) => void;
  children: React.ReactNode;
}

export function BQNProvider({ code, setCode, inputFile, setInputFile, onRun, onOutput, children }: BQNProviderProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const codeRef = useRefCache(code);
  const inputFileRef = useRefCache(inputFile);
  
  const insert = useCallback((text: string, paren?: string) => {
    if(!inputRef.current) return;
    
    inputRef.current.focus();
    
    if(paren && inputRef.current.selectionStart !== inputRef.current.selectionEnd) {
      const { selectionStart, selectionEnd, selectionDirection } = inputRef.current;
      const selection = inputRef.current.value.slice(selectionStart, selectionEnd);
      document.execCommand("insertText", false, text + selection + paren);
      inputRef.current.selectionStart = selectionStart;
      inputRef.current.selectionEnd = selectionEnd + text.length + paren.length;
      inputRef.current.selectionDirection = selectionDirection;
    } else {
      document.execCommand("insertText", false, text);
    }
  }, []);
  
  const run = useCallback(() => {
    const now = Date.now();
    const inputLines = inputFileRef.current?.content?.split("\n")?.reverse();
    if(inputLines && inputLines.length > 0 && inputLines[0] === "") inputLines.shift();
    
    let sampleRate = 8000;
    
    bqn.sysvals.show = (raw: any) => onOutput(parseOutput(raw, Date.now() - now, false, sampleRate));
    bqn.sysvals.getline = () => {
      if(!inputLines || inputLines.length === 0) return bqn("@");
      else return bqn.util.str(inputLines.pop() || "");
    };
    bqn.sysvals.samplerate = () => sampleRate;
    bqn.sysvals.setsamplerate = (raw: any) => {
      if(typeof raw !== "number") throw new Error("•SetSampleRate: 𝕩 must be a number");
      if(raw < 1 || raw >= 2 ** 32) throw new Error(`•SetSampleRate: 𝕩 must be between 1 and ${2 ** 32 - 1}`);
      return sampleRate = Math.round(raw);
    };
    
    onRun();
    
    try {
      const ret = bqn(codeRef.current);
      if(ret) onOutput(parseOutput(ret, Date.now() - now, false, sampleRate));
    } catch(err) {
      console.error(err);
      onOutput(parseOutput(err, Date.now() - now, true));
    }
  }, [codeRef, inputFileRef, onOutput, onRun]);
  
  const state = useMemo(
    () => ({ insert, run, inputRef, codeRef, setCode, inputFileRef, setInputFile }),
    [insert, run, inputRef, codeRef, setCode, inputFileRef, setInputFile],
  );
  
  return (
    <BQNContext.Provider value={state}>
      {children}
    </BQNContext.Provider>
  );
}
