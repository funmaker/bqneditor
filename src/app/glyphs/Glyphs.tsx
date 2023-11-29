import React from "react";
import styled from "styled-components";
import { TokenType } from "../../bqn/tokenizer";
import glyphs from "../../bqn/glyphs";
import { Glyph, GlyphBase } from "./Glyph";

export default function Glyphs() {
  return (
    <StyledGlyphs>
      {glyphs.filter(glyph => glyph.type !== TokenType.UNUSED)
             .map((glyph, id) => <Glyph key={id} glyph={glyph} />)}
      <StyledKeyMap className={`syn-${TokenType.STRING}`}
                    as="a" target="_blank" rel="noreferrer"
                    href="https://mlochbaum.github.io/BQN/keymap.html">
        keymap↗
      </StyledKeyMap>
    </StyledGlyphs>
  );
}

const StyledGlyphs = styled.div`
  padding: 0.25em 0;
  border-bottom: 1px solid var(--border);
`;

const StyledKeyMap = styled(GlyphBase)`
  float: right;
  text-decoration: none;
`;
