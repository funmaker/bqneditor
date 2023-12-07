import React from "react";
import styled, { css } from "styled-components";
import { TokenType } from "../../bqn/tokenizer";
import glyphs from "../../bqn/glyphs";
import useApp from "../../hooks/useApp";
import { Glyph, GlyphBase } from "./Glyph";

export default function Glyphs() {
  const app = useApp();
  const [modKey] = app.modKey.useWatch();
  const [highlight] = app.settings.useWatch("glyphs.modHighlight");
  const [hints] = app.settings.useWatch("glyphs.modHints");
  const [showExtra] = app.settings.useWatch("glyphs.showExtra");
  
  return (
    <StyledGlyphs $highlight={modKey && highlight}>
      {glyphs.filter(glyph => showExtra || glyph.type !== TokenType.UNUSED)
             .map((glyph, id) => <Glyph key={id} glyph={glyph} insert={app.code.insert} showKey={modKey && hints} />)}
      <StyledKeyMap className={`syn-${TokenType.STRING}`}
                    as="a" target="_blank" rel="noreferrer"
                    href="https://mlochbaum.github.io/BQN/keymap.html">
        keymap↗
      </StyledKeyMap>
    </StyledGlyphs>
  );
}

const StyledGlyphs = styled.div<{ $highlight?: boolean }>`
  padding: 0.25em 0;
  
  ${props => props.$highlight && css`background-color: var(--hover)`}
`;

const StyledKeyMap = styled(GlyphBase)`
  float: right;
`;
