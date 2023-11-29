import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BQNProvider } from "../bqn/useBQN";
import { BQNOutput } from "../bqn/output";
import useLocalStorage from "../utils/useLocalStorage";
import Resizer from "../components/Resizer";
import Menu from "./Menu";
import Glyphs from "./glyphs/Glyphs";
import Editor from "./editor/Editor";
import Outputs from "./Outputs";

export interface InputFile {
  content: string;
  fileName: string;
}

export default function App() {
  const [width, setWidth] = useState<number | null>(null);
  const [code, setCode] = useLocalStorage("code", "");
  const [inputFile, setInputFile] = useLocalStorage<InputFile | null>("inputFile", null);
  const [persists, setPersists] = useLocalStorage("persistsOutput", false);
  const [outputs, setOutputs] = useState<BQNOutput[]>([]);
  
  const onOutput = useCallback((output: BQNOutput) => setOutputs(outputs => [...outputs, output]), []);
  const onRun = useCallback(() => !persists && setOutputs([]), [persists]);
  const onClearOutput = useCallback(() => setOutputs([]), []);
  
  return (
    <StyledApp style={{ width: width !== null ? width + "px" : undefined }}>
      <BQNProvider code={code} setCode={setCode} inputFile={inputFile} setInputFile={setInputFile} onRun={onRun} onOutput={onOutput}>
        <Menu inputFile={inputFile} onInputFileChange={setInputFile} />
        <Glyphs />
        <Editor code={code} onCodeChange={setCode} />
        <Outputs outputs={outputs} onClear={onClearOutput} persists={persists} setPersists={setPersists} />
        <Resizer position="left" onResize={setWidth} />
        <Resizer position="right" onResize={setWidth} />
      </BQNProvider>
    </StyledApp>
  );
}

const StyledApp = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  width: 50em;
  padding: 0.5em;
  margin: 0 auto;
  min-width: 20em;
  max-width: calc(100% - 4em);
`;
