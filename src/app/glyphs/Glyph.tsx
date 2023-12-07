import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { Glyph as GlyphDef } from "../../bqn/glyphs";

interface GlyphProps {
  glyph: GlyphDef;
  showKey?: boolean;
  insert: (glyph: string, paren?: string) => void;
}

export function Glyph({ glyph, showKey, insert }: GlyphProps) {
  const [side, setSide] = useState<"left" | "right">("left");
  
  const onMouseEnter = useCallback((ev: React.MouseEvent) => {
    if(ev.pageX > window.innerWidth / 2) setSide("right");
    else setSide("left");
  }, []);
  
  const onMouseDown = useCallback((ev: React.MouseEvent) => {
    if(ev.button === 0) {
      ev.preventDefault();
      insert(glyph.glyph, glyph.paren);
    } else if(ev.button === 1) {
      window.open(glyph.help, "_blank");
    }
  }, [insert, glyph.glyph, glyph.paren, glyph.help]);
  
  let hint = glyph.hint;
  if(hint && glyph.key) hint += `\n\\${glyph.key}`;
  
  let key;
  if(showKey && glyph.key) {
    if(glyph.key === " ") key = "␣";
    else key = glyph.key;
  }
  
  return (
    <GlyphBase className={`syn-${glyph.type}`}
               side={side}
               data-hint={hint}
               data-key={key}
               onMouseEnter={onMouseEnter}
               onMouseDown={onMouseDown}>
      {glyph.glyph}
    </GlyphBase>
  );
}

export const GlyphBase = styled.span<{ side?: "left" | "right" }>`
  display: inline-block;
  position: relative;
  padding: 0.1em 0.2em;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &[data-key]::before {
    content: attr(data-key);
    color: var(--text-color);
    position: absolute;
    bottom: -0.25em;
    right: 0;
    font-size: 75%;
    text-shadow: -1px -1px 0 var(--background);
    font-weight: bold;
  }
  
  &:hover {
    background-color: var(--hover);
    
    &[data-hint]::after {
      content: attr(data-hint);
      pointer-events: none;
      position: absolute;
      top: 100%;
      max-width: 500px;
      z-index: 10;
      padding: 0.1em 0.2em;
      background: var(--background);
      border: 1px solid var(--border);
      color: var(--text-color);
      white-space: pre;
      
      ${props => props.side === "left" && css`
        left: 0;
      `}
      ${props => props.side === "right" && css`
        right: 0;
      `}
    }
  }
`;
