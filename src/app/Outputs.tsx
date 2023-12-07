import React, { useState } from "react";
import styled from "styled-components";
import Resizer from "../components/Resizer";
import Button from "../components/Button";
import useApp from "../hooks/useApp";
import Output from "./Output";

export default function Outputs() {
  const app = useApp();
  const outputs = app.output.useWatch();
  const [persists, setPersists] = app.settings.useWatch("output.persist");
  const [wrap, setWrap] = app.settings.useWatch("output.wrap");
  const [height, setHeight] = useState<number | null>(null);
  
  return (
    <StyledOutputs style={{ height: height !== null ? height + "px" : undefined }}>
      <Resizer position="top" onResize={setHeight} />
      <Buttons>
        <Button onClick={app.output.clear} title="Clear output log">Clear</Button>
        <Button active={wrap} setActive={setWrap} title="Wrap output lines">Wrap</Button>
        <Button active={persists} setActive={setPersists} title="Do not clear output on run">Persist</Button>
      </Buttons>
      <OutputWrap>
        {outputs.map(output => <Output key={output.id} output={output} wrap={wrap} />)}
      </OutputWrap>
    </StyledOutputs>
  );
}

const StyledOutputs = styled.div`
  position: relative;
  height: 50vh;
  min-height: 2em;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  padding: 0.3em 0;
  overflow: hidden;
  
  :not(:first-child) {
    margin-left: 0.5em;
  }
`;

const OutputWrap = styled.div`
  overflow: auto;
  flex: 1;
`;
