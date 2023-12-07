import React, { useCallback } from "react";
import styled from "styled-components";

export interface CheckboxProps extends React.ComponentProps<"input"> {
  label?: string;
  active?: boolean;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line prefer-arrow-callback
export default React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ className, label, active, setActive, ...rest }: CheckboxProps, ref) {
  const onChange = useCallback(() => setActive && setActive(active => !active), [setActive]);
  
  const checkbox = <StyledCheckbox type="checkbox" checked={active} onChange={onChange} {...rest} ref={ref} />;
  
  if(label) return <StyledLabel className={className}>{checkbox}{label}</StyledLabel>;
  return React.cloneElement(checkbox, { className });
});

const StyledCheckbox = styled.input`
  margin-right: 0.5em;
`;

const StyledLabel = styled.label`
  font-size: 75%;
  user-select: none;
`;
