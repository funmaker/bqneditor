import React, { useCallback, useRef } from "react";
import styled, { css } from "styled-components";

interface ResizerProps {
  position: "top" | "bottom" | "left" | "right";
  onResize?: (size: number) => void;
}

export default function Resizer({ position, onResize }: ResizerProps) {
  const captured = useRef(false);
  
  const onPointerDown = useCallback((ev: React.PointerEvent) => {
    captured.current = true;
    ev.currentTarget.setPointerCapture(ev.pointerId);
  }, []);
  
  const onPointerUp = useCallback((ev: React.PointerEvent) => {
    captured.current = false;
    ev.currentTarget.releasePointerCapture(ev.pointerId);
  }, []);
  
  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    const parent = ev.currentTarget.parentElement;
    if(!captured.current || !parent || !onResize) return;
    
    let newSize;
    switch(position) {
      case "top": newSize = parent.clientHeight - ev.nativeEvent.offsetY; break;
      case "bottom": newSize = parent.clientHeight + ev.nativeEvent.offsetY; break;
      case "left": newSize = parent.clientWidth - ev.nativeEvent.offsetX; break;
      case "right": newSize = parent.clientWidth + ev.nativeEvent.offsetX; break;
    }
    
    onResize(newSize);
  }, [onResize, position]);
  
  return (
    <StyledResizer position={position}
                   onPointerDown={onPointerDown}
                   onPointerUp={onPointerUp}
                   onPointerMove={onPointerMove} />
  );
}

const StyledResizer = styled.div<ResizerProps>`
  position: absolute;
  width: 0.5em;
  height: 0.5em;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: var(--hover);
  }
  
  ${props => props.position === "top" && css`
    top: 0;
    left: 0;
    width: 100%;
    cursor: row-resize;
  `}
  ${props => props.position === "bottom" && css`
    bottom: 0;
    left: 0;
    width: 100%;
    cursor: row-resize;
  `}
  ${props => props.position === "left" && css`
    top: 0;
    left: 0;
    height: 100%;
    cursor: col-resize;
  `}
  ${props => props.position === "right" && css`
    top: 0;
    right: 0;
    height: 100%;
    cursor: col-resize;
  `}
`;
