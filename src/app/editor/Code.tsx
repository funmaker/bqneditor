import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import tokenize from "../../bqn/tokenizer";

interface CodeProps {
  className?: string;
  inline?: boolean;
  children: string;
}

export default function Code({ className, inline, children }: CodeProps) {
  const tokens = useMemo(() => tokenize(children), [children]);
  
  const colored = tokens.map((token, id) => {
    if(token.type === null) {
      return token.content;
    } else {
      return <span key={id} className={`syn-${token.type}`}>{token.content}</span>;
    }
  });
  
  return (
    <StyledCode className={className} as={inline ? "span" : "div"} $inline={inline}>
      {colored}
    </StyledCode>
  );
}


const StyledCode = styled.div<{ $inline?: boolean }>`
  white-space: pre-wrap;
  background: var(--editor-bg);
  font-family: BQN386, monospace;
  
  ${props => props.$inline && css`
    padding: 0.125em 0.25em;
    border-radius: 0.2rem;
  `}
`;
