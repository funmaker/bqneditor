import React, { useCallback } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import useBQN from "../bqn/useBQN";
import { downloadFile, openFile } from "../utils/files";
import { InputFile } from "./App";
import Examples from "./Examples";
import ExLink from "../components/ExLink";

interface MenuProps {
  inputFile: InputFile | null;
  onInputFileChange: (fileInput: InputFile | null) => void;
}

export default function Menu({ inputFile, onInputFileChange }: MenuProps) {
  const { run, codeRef, setCode } = useBQN();
  
  const onOpen = useCallback(() => {
    openFile(true, ".bqn", setCode);
  }, [setCode]);
  
  const onSave = useCallback(() => {
    if(!codeRef.current) return;
    
    downloadFile(codeRef.current, "text/plain", "code.bqn");
  }, [codeRef]);
  
  const onOpenInput = useCallback(() => {
    openFile(true, "*", (content, file) => onInputFileChange({ content, fileName: file.name }));
  }, [onInputFileChange]);
  
  const onRemoveInput = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    
    onInputFileChange(null);
  }, [onInputFileChange]);
  
  return (
    <div>
      <a href="/"><StyledLogo src="/static/bqn.svg" alt="bqn" className="logo" /></a>
      <Button onClick={onOpen}>Open</Button>
      <Button onClick={onSave}>Save</Button>
      <Button onClick={run}>Run</Button>
      <Button onClick={onOpenInput}>
        Input
        {inputFile && <>: {inputFile.fileName}</>}
        {inputFile && <StyledX onMouseDown={onRemoveInput}>X</StyledX>}
      </Button>
      <Examples />
      <StyledExLink to="https://github.com/funmaker/bqneditor">
        <Button>GitHub</Button>
      </StyledExLink>
    </div>
  );
}

const StyledLogo = styled.img`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 0.5em;
`;

const StyledX = styled.div`
  transition: color 0.3s ease;
  display: inline-block;
  padding: 0.25em 0.25em 0.25em 0.5em;
  margin: -0.25em -0.25em -0.25em 0;
  
  &:hover {
    color: white;
  }
`;

const StyledExLink = styled(ExLink)`
  margin-left: 0.25em;
`;
