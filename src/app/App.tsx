import React, { useState } from "react";
import styled from "styled-components";
import Resizer from "../components/Resizer";
import { AppProviders, useAppState } from "../hooks/useApp";
import Menu from "./menu/Menu";
import Glyphs from "./glyphs/Glyphs";
import Editor from "./editor/Editor";
import Outputs from "./Outputs";


export default function App() {
  const state = useAppState();
  const [width, setWidth] = useState<number | null>(null);
  
  return (
    <AppProviders {...state}>
      <StyledApp style={{ width: width !== null ? width + "px" : undefined }}>
        <Menu />
        {state.settings.glyphs.show && <Glyphs />}
        <Editor />
        <Outputs />
        <Resizer position="left" onResize={setWidth} />
        <Resizer position="right" onResize={setWidth} />
      </StyledApp>
    </AppProviders>
  );
}

const StyledApp = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  width: 50em;
  padding: 0 0.5em;
  margin: 0 auto;
  min-width: 20em;
  max-width: calc(100% - 4em);
`;
