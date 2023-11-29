import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import useBQN from "../../bqn/useBQN";
import { Glyph as GlyphDef } from "../../bqn/glyphs";

interface GlyphProps {
  glyph: GlyphDef;
}

export function Glyph({ glyph }: GlyphProps) {
  const { insert } = useBQN();
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
  }, [glyph.glyph, glyph.help, insert]);
  
  let hint = glyph.hint;
  if(hint && glyph.key) hint += `\n\\${glyph.key}`;
  
  return (
    <GlyphBase className={`syn-${glyph.type}`}
               side={side}
               data-hint={hint}
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
