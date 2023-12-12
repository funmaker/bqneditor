import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { KeyAction } from "../../hooks/useSettings";
import glyphs from "../../bqn/glyphs";
import useApp from "../../hooks/useApp";
import Code from "./Code";

const MOD_KEYS = ["Shift", "Control", "Alt", "AltGraph", "CapsLock", "Fn", "FnLock", "Meta", "NumLock", "ScrollLock", "Symbol", "SymbolLock", "Hyper", "Super"];

export default function Editor() {
  const app = useApp();
  const code = app.code.useWatch();
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [lineNumbers] = app.settings.useWatch("editor.lineNumbers");
  const [height, setHeight] = useState<number | null>(null);
  
  const onChange = useCallback((ev: React.ChangeEvent<HTMLTextAreaElement>) => app.code.set(ev.currentTarget.value), [app.code]);
  
  const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const keyBinds = Object.entries(app.settings.ref.current.keyBinds).map(([action, bind]) => [action as KeyAction, bind] as const);
    const settings = app.settings.ref.current;
    
    const keyBind = keyBinds.find(
      ([, keyBind]) =>
        keyBind
        && (keyBind.code ? keyBind.code === ev.code : keyBind.key === ev.key)
        && !!keyBind.alt === ev.altKey
        && !!keyBind.shift === ev.shiftKey
        && !!keyBind.ctrl === ev.ctrlKey
        && !!keyBind.meta === ev.metaKey,
    );
    
    if(keyBind) {
      const [action] = keyBind;
      let captured = true;
      
      switch(action) {
        case KeyAction.GLYPH_MOD: {
          if(settings.glyphs.modToggle || !app.modKey.ref.current) {
            app.modKey.toggle();
          } else {
            captured = false;
          }
          break;
        }
        case KeyAction.RUN: app.code.run(); break;
        case KeyAction.SAVE: app.code.save(); break;
        case KeyAction.OPEN: app.code.open(); break;
        case KeyAction.OPEN_INPUT: app.input.open(); break;
        case KeyAction.COMMENT_LINE: app.code.commentLine(); break;
        case KeyAction.FOLD_OUTPUTS: app.settings.set("output.show", show => !show); break;
        case KeyAction.FOLD_GLYPHS: app.settings.set("glyphs.show", show => !show); break;
        default: console.error("Unhandled key action: " + action);
      }
      
      if(captured) {
        ev.preventDefault();
        return;
      }
    }
    
    if(app.modKey.ref.current) {
      if(!settings.glyphs.modToggle && !MOD_KEYS.includes(ev.key)) app.modKey.set(false);
      
      const glyph = glyphs.find(glyph => glyph.key === ev.key);
      if(glyph) {
        ev.preventDefault();
        app.code.insert(glyph.glyph, glyph.paren);
        return;
      }
    }
    
    if(ev.key === "Tab") {
      ev.preventDefault();
      
      if(ev.currentTarget.selectionStart === ev.currentTarget?.selectionEnd) {
        app.code.insert("  ");
      } else {
        app.code.indentLine(ev.shiftKey);
      }
      
      return;
    }
    
    if(ev.currentTarget.selectionStart !== ev.currentTarget.selectionEnd) {
      const glyph = glyphs.find(glyph => glyph.glyph === ev.key);
      if(glyph?.paren) {
        ev.preventDefault();
        app.code.insert(ev.key, glyph.paren);
      }
    }
  }, [app]);
  
  const onScroll = useCallback((ev: React.UIEvent<HTMLTextAreaElement>) => {
    ev.currentTarget.scrollTop = 0;
    ev.currentTarget.scrollLeft = 0;
  }, []);
  
  useEffect(() => {
    if(!codeRef.current) return;
    setHeight(codeRef.current.clientHeight);
  }, [code]);
  
  return (
    <StyledEditor $lineNumbers={lineNumbers}>
      <StyledCode lineNumbers={lineNumbers} ref={codeRef}>
        {code}
      </StyledCode>
      <StyledTextArea autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                      value={code} onChange={onChange} onKeyDown={onKeyDown} onScroll={onScroll}
                      style={{ height: height ? height + "px" : undefined }} $lineNumbers={lineNumbers}
                      ref={app.code.inputRef} />
    </StyledEditor>
  );
}

const StyledEditor = styled.div<{ $lineNumbers?: boolean }>`
  position: relative;
  overflow: auto;
  background: var(--editor-bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  flex: 1;
`;

const StyledTextArea = styled.textarea<{ $lineNumbers?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  padding: 0.5rem;
  color: transparent;
  caret-color: var(--caret-color);
  background: transparent;
  border: none;
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  overflow: hidden;
  resize: none;
  
  ${props => props.$lineNumbers && css`
    padding-left: 4em;
  `}
  
  &:focus {
    outline: none;
  }
`;

const StyledCode = styled(Code)`
  width: 100%;
  min-height: 100%;
  
  &::after {
    content: " ";
    display: inline;
  }
`;
