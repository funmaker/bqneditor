import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import Button from "../components/Button";
import examples, { Directory } from "../utils/examples";
import useBQN from "../bqn/useBQN";

export default function Examples() {
  const [open, setOpen] = useState(false);
  const onClick = useCallback(() => setOpen(open => !open), []);
  
  useEffect(() => {
    if(!open) return;
    
    const onClick = (ev: MouseEvent) => {
      console.log(ev.target);
      setOpen(false);
    };
    
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);
  
  return <DirectoryItem name="Examples" content={examples} direction="bottom" as={Button} open={open} onClick={onClick} />;
}

type Direction = "top" | "right" | "bottom" | "left";

interface ListProps {
  directory: Directory;
  parent: React.RefObject<HTMLElement>;
  direction: Direction;
}

export function List({ directory, parent, direction }: ListProps) {
  const [position, setPosition] = useState<null | CSSProperties>(null);
  const [selected, setSelected] = useState<string | null>(null);
  
  const directories = Object.entries(directory).filter((entry): entry is [string, Directory] => typeof entry[1] === "object");
  const files = Object.entries(directory).filter((entry): entry is [string, string] => typeof entry[1] === "string");
  
  const onDirectoryClick = useCallback((name: string) => setSelected(selected => name === selected ? null : name), []);
  
  useEffect(() => {
    if(!parent.current) {
      setPosition(null);
      return;
    }
    const rect = parent.current.getBoundingClientRect();
    
    switch(direction) {
      case "top": setPosition({ bottom: rect.top, left: rect.left }); break;
      case "right": setPosition({ top: rect.top, left: rect.right }); break;
      case "bottom": setPosition({ top: rect.bottom, left: rect.left }); break;
      case "left": setPosition({ top: rect.top, right: rect.left }); break;
      default: setPosition(null);
    }
  }, [direction, parent]);
  
  if(!position) return;
  return (
    <StyledList style={position}>
      {directories.map(([name, content]) => <DirectoryItem key={name}
                                                           name={name}
                                                           content={content}
                                                           direction="right"
                                                           open={selected === name}
                                                           onClick={onDirectoryClick} />)}
      {files.map(([name, content]) => <FileItem key={name}
                                                name={name}
                                                content={content} />)}
    </StyledList>
  );
}

interface FileItemProps {
  name: string;
  content: string;
}

function FileItem({ name, content }: FileItemProps) {
  const { setCode } = useBQN();
  
  const onClick = useCallback(() => setCode(content), [content, setCode]);
  
  return <StyledItem onClick={onClick}>{name}</StyledItem>;
}

const triangles: Record<Direction, string> = {
  top: "▴▾",
  right: "▸◂",
  bottom: "▾▴",
  left: "◂▸",
};

interface DirectoryItemProps {
  as?: React.ElementType<React.ComponentProps<typeof Button>>;
  name: string;
  content: Directory;
  direction: Direction;
  open: boolean;
  onClick: (name: string) => void;
}

function DirectoryItem({ as, name, content, direction, open, onClick: onClickProp }: DirectoryItemProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  const onClick = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    
    onClickProp(name);
  }, [onClickProp, name]);
  
  const C = as || StyledItem;
  
  return (
    <>
      <C active={open} onClick={onClick} ref={buttonRef}>{name} {triangles[direction][+open]}</C>
      {open && <List directory={content} parent={buttonRef} direction={direction} />}
    </>
  );
}

const StyledList = styled.div`
  position: fixed;
  z-index: 5;
`;

const StyledItem = styled(Button)`
  display: block;
  width: 100%;
  margin: 0 !important;
  border-radius: 0;
  text-align: left;
`;
