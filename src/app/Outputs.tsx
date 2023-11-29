import React, { useState } from "react";
import styled from "styled-components";
import useLocalStorage from "../utils/useLocalStorage";
import Resizer from "../components/Resizer";
import Button from "../components/Button";
import { BQNOutput } from "../bqn/output";
import Output from "./Output";

interface OutputsProps {
  outputs: BQNOutput[];
  onClear: () => void;
  persists: boolean;
  setPersists: (action: React.SetStateAction<boolean>) => void;
}

export default function Outputs({ outputs, onClear, persists, setPersists }: OutputsProps) {
  const [wrap, setWrap] = useLocalStorage("wraputput", false);
  const [height, setHeight] = useState<number | null>(null);
  
  return (
    <StyledOutputs style={{ height: height !== null ? height + "px" : undefined }}>
      <Buttons>
        <Button onClick={onClear}>Clear</Button>
        <Button active={wrap} setActive={setWrap}>Wrap</Button>
        <Button active={persists} setActive={setPersists}>Persist</Button>
      </Buttons>
      {outputs.map(output => <Output key={output.id} output={output} wrap={wrap} />)}
      <Resizer position="top" onResize={setHeight} />
    </StyledOutputs>
  );
}

const StyledOutputs = styled.div`
  position: relative;
  border-top: 1px solid var(--border);
  height: 50vh;
  min-height: 2em;
  overflow: auto;
`;

const Buttons = styled.div`
  position: sticky;
  top: 0;
  padding: 0.5em 0;
  overflow: hidden;
  background: var(--background);
  
  :not(:first-child) {
    margin-left: 0.5em;
  }
`;
