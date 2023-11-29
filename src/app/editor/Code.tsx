import React, { useMemo } from "react";
import styled from "styled-components";
import tokenize from "../../bqn/tokenizer";

interface CodeProps {
  code: string;
}

export default function Code({ code }: CodeProps) {
  const tokens = useMemo(() => tokenize(code), [code]);
  
  const children = tokens.map((token, id) => {
    if(token.type === null) {
      return token.content;
    } else {
      return <span key={id} className={`syn-${token.type}`}>{token.content}</span>;
    }
  });
  
  return (
    <StyledCode>
      {children}
    </StyledCode>
  );
}


const StyledCode = styled.div`
  white-space: pre-wrap;
`;
