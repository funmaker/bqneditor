import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface ModalProps extends React.ComponentProps<"dialog"> {
  defaultOpen?: boolean;
  trigger: React.ReactElement;
}

export default function Modal({ defaultOpen = false, trigger, children, ...rest }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  
  const triggerClone = React.cloneElement(trigger, { onClick: onOpen });
  
  const onClick = useCallback((ev: React.MouseEvent<HTMLDialogElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    if(ev.clientX < rect.left
    || ev.clientY < rect.top
    || ev.clientX > rect.right
    || ev.clientY > rect.bottom) {
      onClose();
    }
  }, [onClose]);
  
  useEffect(() => {
    if(!dialogRef.current) return;
    if(open) dialogRef.current.showModal();
    else dialogRef.current.close();
  }, [open]);
  
  return (
    <>
      {triggerClone}
      <StyledDialog onClose={onClose} ref={dialogRef} onClick={onClick} {...rest}>
        {children}
      </StyledDialog>
    </>
  );
}

const StyledDialog = styled.dialog`
  top: 50%;
  left: 50%;
  font-size: 1rem;
  line-height: normal;
  transform: translate(-50%, -50%);
  padding: 1rem;
  background-color: var(--background);
  border: 2px solid var(--border);
  color: var(--text-color);
`;
