import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { BQNOutput, formatOutput } from "../bqn/output";
import Button from "../components/Button";

interface OutputProps {
  output: BQNOutput;
  wrap?: boolean;
}

export default function Output({ output, wrap }: OutputProps) {
  const ref = useRef<null | HTMLDivElement>(null);
  const [raw, setRaw] = useState(false);
  
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);
  
  let delay: string;
  if(output.delay < 10) delay = output.delay.toFixed(2) + "ms";
  else if(output.delay < 100) delay = output.delay.toFixed(1) + "ms";
  else if(output.delay < 1000) delay = output.delay.toFixed(0) + "ms";
  else delay = (output.delay / 1000).toFixed(2) + "s";
  
  const actions = useMemo(() => {
    const actions = [<Delay key="delay">{delay}</Delay>];
    
    if(output.image) actions.push(<Button key="raw" active={raw} setActive={setRaw}>RAW</Button>);
    
    return actions;
  }, [delay, output.image, raw]);
  
  if(!raw && output.image) {
    return <StyledOutput ref={ref}><ImageOutput value={output.image} actions={actions} /></StyledOutput>;
  } else if(!raw && output.audio) {
    return <StyledOutput ref={ref}><AudioOutput value={output.audio} actions={actions} /></StyledOutput>;
  } else {
    return <StyledOutput ref={ref}><TextOutput value={output.text ?? output.raw} actions={actions} wrap={wrap} /></StyledOutput>;
  }
}

interface OutputLayoutProps {
  children: React.ReactNode;
  actions: React.ReactNode[];
}

function OutputLayout({ children, actions }: OutputLayoutProps) {
  return (
    <>
      <OutputContent>{children}</OutputContent>
      <Menu>{actions}</Menu>
    </>
  );
}

interface GenericOutputProps<T> {
  value: T;
  actions: React.ReactNode[];
  wrap?: boolean;
}

const maxLineLen = 1000;
const maxLines = 15;

function TextOutput({ value, actions, wrap }: GenericOutputProps<any>) {
  const [expand, setExpand] = useState(false);
  
  const text = useMemo(() => {
    try {
      if(typeof value === "string") return value;
      else return formatOutput(value);
    } catch(err) {
      return (err as Error).message;
    }
  }, [value]);
  
  let output;
  let overflow = false;
  if(expand) {
    output = text;
    overflow = true;
  } else {
    const lines = text.split("\n", maxLines + 1);
    if(lines.length > maxLines) {
      lines[maxLines] = "...";
      overflow = true;
    }
    
    output = lines.map(line => line.length > maxLineLen && !wrap ? line.slice(0, 997) + "..." : line).join("\n");
  }
  
  return (
    <OutputLayout actions={[
                    ...actions,
                    overflow && <Button key="expand" active={expand} setActive={setExpand}>EXPAND</Button>,
                  ]}>
      <TextContent $wrap={wrap}>{output}</TextContent>
    </OutputLayout>
  );
}

function ImageOutput({ value, actions }: GenericOutputProps<ImageData>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const small = value.width < 256 && value.height < 256;
  const [zoom, setZoom] = useState(small);
  const [smooth, setSmooth] = useState(!small);
  
  let scale: null | number = null;
  if(small && zoom) {
    scale = 256 / Math.max(value.width, value.height);
    if(scale < 1) scale = null;
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if(!canvas || !ctx) return;
    
    canvas.width = value.width;
    canvas.height = value.height;
    ctx.putImageData(value, 0, 0);
  }, [value]);
  
  return (
    <OutputLayout actions={[
      ...actions,
      small && <Button active={!zoom} setActive={setZoom}>ORIG SIZE</Button>,
      small && <Button active={smooth} setActive={setSmooth}>SMOOTH</Button>,
    ]}>
      <StyledCanvas width={value.width} height={value.height} ref={canvasRef}
                    $smooth={smooth}
                    style={{
                      width: scale !== null ? value.width * scale : undefined,
                      height: scale !== null ? value.height * scale : undefined,
                    }} />
    </OutputLayout>
  );
}


function AudioOutput({ value, actions }: GenericOutputProps<Blob>) {
  const [url, setUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const url = URL.createObjectURL(value);
    setUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
      setUrl(null);
    };
  }, [value]);
  
  return (
    <OutputLayout actions={[
      ...actions,
    ]}>
      <StyledAudio src={url || undefined} controls />
    </OutputLayout>
  );
}

const StyledOutput = styled.div`
  display: flex;
  margin-bottom: 0.5em;
`;

const Menu = styled.div`
  position: sticky;
  top: 0;
  float: right;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-end;
  align-self: flex-start;
`;

const Delay = styled.span`
  opacity: 0.75;
`;

const OutputContent = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TextContent = styled.span<{ $wrap?: boolean }>`
  ${props => props.$wrap ? css`white-space: pre-wrap` : css`white-space: pre;`}
`;

const StyledCanvas = styled.canvas<{ $smooth?: boolean }>`
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: top left;
  max-width: 100%;
  max-height: 512px;
  
  ${props => !props.$smooth && css`
    image-rendering: pixelated;
  `}
`;

const StyledAudio = styled.audio`
`;
