import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import tokenize, { TokenType } from "../../bqn/tokenizer";

interface CodeProps {
  className?: string;
  inline?: boolean;
  lineNumbers?: boolean;
  children: string;
}

// eslint-disable-next-line prefer-arrow-callback
export default React.forwardRef<HTMLElement, CodeProps>(function Code({ className, inline, lineNumbers, children }, ref) {
  const tokens = useMemo(() => tokenize(children), [children]);
  
  const colored = tokens.map((token, id) => {
    if(token.type === TokenType.NEW_LINE && lineNumbers) {
      return <>{token.content}<LineStart /></>;
    } else if(token.type === null || token.type === TokenType.NEW_LINE) {
      return token.content;
    } else {
      return <span key={id} className={`syn-${token.type}`}>{token.content}</span>;
    }
  });
  
  return (
    <StyledCode className={className} as={inline ? "span" : "div"} $inline={inline} $lineNumbers={lineNumbers} ref={ref}>
      {lineNumbers && <LineStart />}
      {colored}
    </StyledCode>
  );
});


const StyledCode = styled.div<{ $inline?: boolean; $lineNumbers?: boolean }>`
  white-space: pre-wrap;
  background: var(--editor-bg);
  font-family: BQN386, monospace;
  counter-reset: line;
  padding: 0.5em;
  box-sizing: border-box;
  
  ${props => props.$inline && css`
    padding: 0.125em 0.25em;
    border-radius: 0.2rem;
  `}
  
  ${props => props.$lineNumbers && css`
    margin-left: calc(3.5em - 1px);
    border-left: 1px solid var(--light-border);
  `}
`;

const LineStart = styled.span`
  &::before {
    counter-increment: line;
    content: counter(line);
    position: absolute;
    left: 0.5em;
    width: 2em;
    text-align: right;
    color: var(--line-numbers);
  }
`;
