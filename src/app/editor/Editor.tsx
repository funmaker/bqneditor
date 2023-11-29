import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import useBQN from "../../bqn/useBQN";
import glyphs from "../../bqn/glyphs";
import Code from "./Code";

const MOD_KEYS = ["Shift", "Control", "Alt", "AltGraph", "CapsLock", "Fn", "FnLock", "Meta", "NumLock", "ScrollLock", "Symbol", "SymbolLock", "Hyper", "Super"];

interface EditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export default function Editor({ code, onCodeChange }: EditorProps) {
  const { inputRef, insert, run } = useBQN();
  const keyMapRef = useRef(false);
  
  const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => onCodeChange(ev.currentTarget.value), [onCodeChange]);
  
  const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(keyMapRef.current && !MOD_KEYS.includes(ev.key)) {
      keyMapRef.current = false;
      const glyph = glyphs.find(glyph => glyph.key === ev.key);
      if(glyph) {
        ev.preventDefault();
        insert(glyph.glyph, glyph.paren);
        return;
      }
    } else if(ev.key === "\\") {
      ev.preventDefault();
      keyMapRef.current = true;
    }
    
    if(ev.key === "Tab") {
      ev.preventDefault();
      if(ev.currentTarget.selectionStart === ev.currentTarget?.selectionEnd) insert("  ");
      else {
        const { selectionStart, selectionEnd, selectionDirection } = ev.currentTarget;
        const lines = ev.currentTarget.value.split("\n");
        const endings: number[] = [];
        for(const line of lines) endings.push((endings[endings.length - 1] || -1) + line.length + 1);
        const startLine = endings.findIndex(ending => selectionStart <= ending);
        let startLineOffset = startLine > 0 ? selectionStart - endings[startLine - 1] - 1 : selectionStart;
        const endLine = endings.findIndex(ending => selectionEnd <= ending);
        let endLineOffset = endLine > 0 ? selectionEnd - endings[endLine - 1] - 1 : selectionEnd;
        
        for(let l = startLine; l <= endLine; l++) {
          if(ev.shiftKey) {
            const matched = lines[l].match(/^ ? ?/)?.at(0)?.length || 0;
            lines[l] = lines[l].slice(matched);
            
            if(l === startLine) startLineOffset = Math.max(0, startLineOffset - matched);
            if(l === endLine) endLineOffset = Math.max(0, endLineOffset - matched);
          } else {
            lines[l] = "  " + lines[l];
            
            if(l === startLine && startLineOffset > 0) startLineOffset += 2;
            if(l === endLine) endLineOffset += 2;
          }
        }
        
        
        console.log(startLine, startLineOffset, endLine, endLineOffset);
        
        ev.currentTarget.select();
        ev.currentTarget.selectionStart = startLine > 0 ? endings[startLine - 1] + 1 : 0;
        ev.currentTarget.selectionEnd = endings[endLine] || 0;
        ev.currentTarget.selectionDirection = "forward";
        insert(lines.slice(startLine, endLine + 1).join("\n"));
        
        ev.currentTarget.selectionStart = lines.slice(0, startLine).reduce((acc, line) => acc + line.length + 1, 0) + startLineOffset;
        ev.currentTarget.selectionEnd = lines.slice(0, endLine).reduce((acc, line) => acc + line.length + 1, 0) + endLineOffset;
        ev.currentTarget.selectionDirection = selectionDirection;
      }
    }
    
    if(ev.key === "Enter" && (ev.shiftKey || ev.ctrlKey)) {
      ev.preventDefault();
      run();
    }
    
    if(ev.currentTarget.selectionStart !== ev.currentTarget.selectionEnd) {
      const glyph = glyphs.find(glyph => glyph.glyph === ev.key);
      if(glyph?.paren) {
        ev.preventDefault();
        insert(ev.key, glyph.paren);
      }
    }
  }, [insert, run]);
  
  return (
    <StyledEditor>
      <StyledCode code={code} />
      <StyledTextArea autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                      value={code} onChange={onChange} onKeyDown={onKeyDown}
                      ref={inputRef} />
    </StyledEditor>
  );
}

function findLine(lines: string[], position: number) {
  for(let l = 0; l < lines.length; l++) {
    if(position <= lines[l].length) {
      return l;
    } else {
      position -= lines[l].length + 1;
    }
  }
  
  return  lines.length - 1;
}

const StyledEditor = styled.div`
  position: relative;
  overflow: auto;
  background: #08080c;
  flex: 1;
  padding: 0.5rem;
`;

const StyledTextArea = styled.textarea`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  color: transparent;
  caret-color: var(--caret-color);
  background: transparent;
  border: none;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  overflow: hidden;
  resize: none;
  padding: 0.5rem;
  
  &:focus {
    outline: none;
  }
`;

const StyledCode = styled(Code)`
  width: 100%;
  min-height: 100%;
  padding: 0.5em;
`;
