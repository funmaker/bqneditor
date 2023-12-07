import React, { useCallback } from "react";
import styled from "styled-components";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import useApp from "../../hooks/useApp";

export default function Input() {
  const app = useApp();
  const input = app.input.useWatch();
  
  const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = ev.currentTarget.value;
    
    app.input.set(file => ({
      fileName: file?.fileName || "input.txt",
      content: newContent,
    }));
  }, [app.input]);
  
  const trigger = (
    <Button title="Edit program input">
      Input
      {input && <>: {input.fileName}</>}
      {input && <StyledX onMouseDown={app.input.close}>X</StyledX>}
    </Button>
  );
  
  return (
    <Modal trigger={trigger}>
      <Row>
        <h2>Program Input</h2>
        <Buttons>
          <Button onClick={app.input.close}>Clear</Button>
          <Button onClick={app.input.save}>Download</Button>
          <Button onClick={app.input.open}>Upload File</Button>
        </Buttons>
      </Row>
      <StyledTextArea value={input?.content || ""} onChange={onChange} ref={app.input.inputRef} />
    </Modal>
  );
}

const StyledX = styled.div`
  transition: color 0.3s ease;
  display: inline-block;
  padding: 0.25em 0.25em 0.25em 0.5em;
  margin: -0.25em -0.25em -0.25em 0;
  
  &:hover {
    color: white;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Buttons = styled.div`
  align-self: start;
`;

const StyledTextArea = styled.textarea`
  width: 50em;
  height: 50em;
  padding: 0.5em;
  margin-top: 1em;
  background: var(--editor-bg);
  border: 1px solid var(--border);
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`;
