import { useContext, useMemo, useRef } from "react";
import useLocalStorage from "./useLocalStorage";
import { useRefCache } from "./useRefCache";
import { AppInputState, InputContext } from "./useApp";
import { downloadFile, openFile } from "../utils/files";

export interface InputFile {
  content: string;
  fileName: string;
}

export default function useInput() {
  return useContext(InputContext);
}

export function useInputState(): [InputFile | null, AppInputState] {
  const [inputFile, setInputFile] = useLocalStorage<InputFile | null>("input", null);
  const inputFileRef = useRefCache(inputFile);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  
  const state = useMemo<AppInputState>(() => ({
    set: setInputFile,
    save: () => inputFileRef.current && downloadFile(inputFileRef.current.content, "text/plain", inputFileRef.current.fileName),
    open: () => openFile(true, "*", (content, file) => setInputFile({ content, fileName: file.name })),
    close: () => setInputFile(null),
    useWatch: useInput,
    ref: inputFileRef,
    inputRef,
  }), [inputFileRef, setInputFile]);
  
  return [inputFile, state];
}
