import React from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import ExLink from "../../components/ExLink";
import useApp from "../../hooks/useApp";
import Examples from "./Examples";
import Settings from "./Settings";
import Input from "./Input";
import Changelog from "./Changelog";
import Help from "./Help";

export default function Menu() {
  const app = useApp();
  const [showGlyphs, setShowGlyphs] = app.settings.useWatch("glyphs.show");
  
  return (
    <StyledMenu>
      <a href="/"><StyledLogo src="/static/bqn.svg" alt="bqn" className="logo" /></a>
      <Button onClick={app.code.open} title="Load code from a local file">Open</Button>
      <Button onClick={app.code.save} title="Download code as a file">Save</Button>
      <Button onClick={app.code.run} title="Run code">Run</Button>
      <Input />
      <Settings />
      <Examples />
      <Changelog />
      <Help />
      <ExLink to="https://mlochbaum.github.io/BQN/doc/index.html">
        <Button title="Source code">Docs↗</Button>
      </ExLink>
      <ExLink to="https://github.com/funmaker/bqneditor">
        <Button title="Source code">GitHub↗</Button>
      </ExLink>
      
      <RightButton setActive={setShowGlyphs} title="Toggle Glyphs">{showGlyphs ? "▾" : "▴"}</RightButton>
    </StyledMenu>
  );
}

const StyledMenu = styled.div`
  display: flex;
  gap: 0.3em;
  flex-wrap: wrap;
  align-items: center;
  line-height: 0;
  
  > * {
    margin: 0 !important;
  }
`;

const StyledLogo = styled.img`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  vertical-align: middle;
`;

const RightButton = styled(Button)`
  margin-left: auto !important;
`;
