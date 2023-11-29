import React, { useCallback } from "react";
import styled, { css } from "styled-components";

export interface ButtonProps extends React.ComponentProps<"button"> {
  active?: boolean;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line prefer-arrow-callback
export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ active, setActive, ...rest }: ButtonProps, ref) {
  const onClick = useCallback(() => setActive && setActive(active => !active), [setActive]);
  
  return <StyledButton $active={active} onClick={onClick} {...rest} ref={ref} />;
});

const StyledButton = styled.button<{ $active?: boolean }>`
  border: 1px solid #3e4556;
  background: #0f1d31;
  transition: background-color 0.15s;
  color: var(--text-color);
  border-radius: 0.5em;
  cursor: pointer;
  outline: none;
  font-weight: bold;
  position: relative;
  padding: 0.25em;
  
  &:hover, &:focus {
    background: #172e50;
  }
  
  &:active {
    background: #21487e;
  }
  
  & + & {
    margin-left: 0.5em;
  }
  
  ${props => props.$active && css`
    color: #1B94D1;
  `}
`;
