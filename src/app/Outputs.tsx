import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import Resizer from "../components/Resizer";
import Button from "../components/Button";
import useApp from "../hooks/useApp";
import Output from "./Output";

export default function Outputs() {
  const app = useApp();
  const outputs = app.output.useWatch();
  const [show, setShow] = app.settings.useWatch("output.show");
  const [persists, setPersists] = app.settings.useWatch("output.persist");
  const [wrap, setWrap] = app.settings.useWatch("output.wrap");
  const [height, setHeight] = useState<number | null>(null);
  
  const onHeightChange = useCallback((newHeight: number) => {
    setShow(true);
    setHeight(newHeight);
  }, [setShow]);
  
  return (
    <StyledOutputs style={{ height: height !== null && show ? height + "px" : undefined }} $fold={!show}>
      <Resizer position="top" onResize={onHeightChange} />
      <Buttons>
        <Button onClick={app.output.clear} title="Clear output log">Clear</Button>
        <Button active={wrap} setActive={setWrap} title="Wrap output lines">Wrap</Button>
        <Button active={persists} setActive={setPersists} title="Do not clear output on run">Persist</Button>
        
        <RightButton setActive={setShow} title="Toggle Glyphs">{show ? "▴" : "▾"}</RightButton>
      </Buttons>
      <OutputWrap>
        {show && outputs.map(output => <Output key={output.id} output={output} wrap={wrap} />)}
      </OutputWrap>
    </StyledOutputs>
  );
}

const StyledOutputs = styled.div<{ $fold?: boolean }>`
  position: relative;
  height: 30vh;
  min-height: 2em;
  display: flex;
  flex-direction: column;
  
  ${props => props.$fold && css`
    height: 2em;
  `};
`;

const Buttons = styled.div`
  display: flex;
  padding: 0.5em 0;
  overflow: hidden;
  
  :not(:first-child) {
    margin-left: 0.5em;
  }
`;

const RightButton = styled(Button)`
  margin-left: auto !important;
`;

const OutputWrap = styled.div`
  overflow: auto;
  flex: 1;
`;
