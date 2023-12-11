import { useCallback, useContext, useMemo, useRef } from "react";
import bqn from "../bqn/bqn";
import { parseOutput } from "../bqn/output";
import { downloadFile, openFile } from "../utils/files";
import useLocalStorage from "./useLocalStorage";
import { useRefCache } from "./useRefCache";
import { AppCodeState, AppInputState, AppOutputState, AppSettingsState, CodeContext } from "./useApp";

export default function useCode() {
  return useContext(CodeContext) || "";
}

export function useCodeState(input: AppInputState, output: AppOutputState, settings: AppSettingsState): [string, AppCodeState] {
  const [code, setCode] = useLocalStorage("code", "");
  const codeRef = useRefCache(code);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  
  const insert = useCallback((text: string, paren?: string) => {
    if(!inputRef.current) return;
    
    inputRef.current.focus();
    
    if(paren && inputRef.current.selectionStart !== inputRef.current.selectionEnd) {
      const { selectionStart, selectionEnd, selectionDirection } = inputRef.current;
      const selection = inputRef.current.value.slice(selectionStart, selectionEnd);
      document.execCommand("insertText", false, text + selection + paren);
      inputRef.current.selectionStart = selectionStart + text.length;
      inputRef.current.selectionEnd = selectionEnd + text.length;
      inputRef.current.selectionDirection = selectionDirection;
    } else {
      document.execCommand("insertText", false, text);
    }
  }, []);
  
  const setCodeEx = useCallback((code: string, preserveHistory?: boolean) => {
    if(!inputRef.current) return;
    
    if(preserveHistory) {
      inputRef.current.focus();
      inputRef.current.select();
      insert(code);
      inputRef.current.selectionStart = inputRef.current.selectionEnd = 0;
    } else {
      setCode(code);
    }
  }, [insert, setCode]);
  
  const run = useCallback(() => {
    const now = Date.now();
    const inputLines = input.ref.current?.content?.split("\n")?.reverse();
    const multimedia = settings.ref.current.output.multimedia;
    if(inputLines && inputLines.length > 0 && inputLines[0] === "") inputLines.shift();
    
    let sampleRate = 8000;
    
    bqn.sysvals.show = (raw: any) => output.append(parseOutput(raw, Date.now() - now, false, sampleRate, multimedia));
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
    
    if(!settings.ref.current.output.persist) output.clear();
    
    try {
      const ret = bqn(codeRef.current);
      if(ret) output.append(parseOutput(ret, Date.now() - now, false, sampleRate, multimedia));
    } catch(err) {
      console.error(err);
      output.append(parseOutput(err, Date.now() - now, true));
    }
  }, [codeRef, input.ref, output, settings.ref]);
  
  const mapLines = useCallback((callback: (lines: string[]) => string[]) => {
    const input = inputRef.current;
    if(!input) return;
    
    const { selectionStart, selectionEnd, selectionDirection } = input;
    const lines = input.value.split("\n");
    const endings: number[] = [];
    for(const line of lines) endings.push((endings[endings.length - 1] || -1) + line.length + 1);
    const startLine = endings.findIndex(ending => selectionStart <= ending);
    let startLineOffset = startLine > 0 ? selectionStart - endings[startLine - 1] - 1 : selectionStart;
    const endLine = endings.findIndex(ending => selectionEnd <= ending);
    let endLineOffset = endLine > 0 ? selectionEnd - endings[endLine - 1] - 1 : selectionEnd;
    
    const mapped = callback(lines.slice(startLine, endLine + 1));
    
    for(let l = startLine; l <= endLine; l++) {
      const change = mapped[l - startLine].length - lines[l].length;
      lines[l] = mapped[l - startLine];
      
      if(l === startLine) {
        startLineOffset += change;
        if(startLineOffset < 0) startLineOffset = 0;
        if(startLineOffset > lines[l].length) startLineOffset = lines[l].length;
      }
      if(l === endLine) {
        endLineOffset += change;
        if(endLineOffset < 0) endLineOffset = 0;
        if(endLineOffset > lines[l].length) endLineOffset = lines[l].length;
      }
    }
    
    input.select();
    input.selectionStart = startLine > 0 ? endings[startLine - 1] + 1 : 0;
    input.selectionEnd = endings[endLine] || 0;
    input.selectionDirection = "forward";
    
    insert(lines.slice(startLine, endLine + 1).join("\n"));
    
    input.selectionStart = lines.slice(0, startLine).reduce((acc, line) => acc + line.length + 1, 0) + startLineOffset;
    input.selectionEnd = lines.slice(0, endLine).reduce((acc, line) => acc + line.length + 1, 0) + endLineOffset;
    input.selectionDirection = selectionDirection;
  }, [insert]);
  
  const indentLine = useCallback((back?: boolean) => {
    mapLines(lines =>
      back
        ? lines.map(line => line.slice(line.match(/^ ? ?/)?.at(0)?.length || 0))
        : lines.map(line => "  " + line));
  }, [mapLines]);
  
  const commentLine = useCallback(() => {
    mapLines(lines => {
      const level = lines.map(line => line.match(/^ */)?.at(0)?.length || 0)
                          .reduce((acc, val) => Math.min(acc, val));
      const indent = " ".repeat(level);
      
      if(lines.every(line => line.slice(level).startsWith("#"))) {
        return lines.map(line => indent + line.slice(level + 1));
      } else {
        return lines.map(line => indent + "#" + line.slice(level));
      }
    });
  }, [mapLines]);
  
  const state = useMemo<AppCodeState>(() => ({
    insert,
    set: setCodeEx,
    run,
    save: () => downloadFile(codeRef.current, "text/plain", "code.bqn"),
    open: () => openFile(true, ".bqn", file => setCodeEx(file, true)),
    indentLine,
    commentLine,
    useWatch: useCode,
    ref: codeRef,
    inputRef,
  }), [codeRef, commentLine, indentLine, insert, run, setCodeEx]);
  
  return [code, state];
}
