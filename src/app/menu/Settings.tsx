import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Checkbox, { CheckboxProps } from "../../components/Checkbox";
import useApp from "../../hooks/useApp";
import { FlattenedSettings, KeyBind, SettingsQuery, WatchSettings } from "../../hooks/useSettings";

export default function Settings() {
  const app = useApp();
  
  const resetSettings = useCallback(() => {
    if(confirm("Are you sure you want to reset all settings?")) {
      app.settings.reset();
    }
  }, [app.settings]);
  
  /* eslint-disable react/jsx-props-no-multi-spaces */
  return (
    <StyledModal trigger={<Button>Settings</Button>}>
      <Row>
        <h2>Settings</h2>
        <ResetButton onClick={resetSettings}>Reset to defaults</ResetButton>
      </Row>
      
      <Header><h4>Glyphs</h4></Header>
      <CheckboxRow path="glyphs.show"         useWatch={app.settings.useWatch} label="Show glyphs palette" />
      <CheckboxRow path="glyphs.modToggle"    useWatch={app.settings.useWatch} label="Glyph mod key acts as a toggle" />
      <CheckboxRow path="glyphs.modHighlight" useWatch={app.settings.useWatch} label="Highliht palette when typing glyphs" />
      <CheckboxRow path="glyphs.modHints"     useWatch={app.settings.useWatch} label="Show hints when typing glyphs" />
      <CheckboxRow path="glyphs.showExtra"    useWatch={app.settings.useWatch} label="Show extra glyphs" />
      
      <Header><h4>Output</h4></Header>
      <CheckboxRow path="output.wrap"       useWatch={app.settings.useWatch} label="Wrap long lines" />
      <CheckboxRow path="output.persist"    useWatch={app.settings.useWatch} label="Do not clear output log on run" />
      <CheckboxRow path="output.multimedia" useWatch={app.settings.useWatch} label="Enable multimedia output" />
      
      <Header>
        <h4>Keybinds</h4>
        <Label>Double click to unset</Label>
      </Header>
      <KeyBindRow path="keyBinds.glyphMod"    useWatch={app.settings.useWatch} label="Glyph mod key" />
      <KeyBindRow path="keyBinds.run"         useWatch={app.settings.useWatch} label="Run code" />
      <KeyBindRow path="keyBinds.open"        useWatch={app.settings.useWatch} label="Upload code" />
      <KeyBindRow path="keyBinds.openInput"   useWatch={app.settings.useWatch} label="Upload input file" />
      <KeyBindRow path="keyBinds.save"        useWatch={app.settings.useWatch} label="Download code" />
      <KeyBindRow path="keyBinds.commentLine" useWatch={app.settings.useWatch} label="(Un)Comment lines" />
      <KeyBindRow path="keyBinds.foldOutputs" useWatch={app.settings.useWatch} label="Hide output log" />
    </StyledModal>
  );
  /* eslint-enable react/jsx-props-no-multi-spaces */
}

interface CheckboxRowProps<Path> extends CheckboxProps {
  path: Path;
  useWatch: WatchSettings;
}

function CheckboxRow<Path extends TypedPaths<boolean>>({ path, useWatch, ...rest }: CheckboxRowProps<Path>) {
  const [active, setActive] = useWatch<Path, boolean>(path);
  
  return (
    <Row>
      <Checkbox active={active} setActive={setActive} {...rest} ref={undefined} />
    </Row>
  );
}

interface KeyBindRowProps<Path> {
  path: Path;
  useWatch: WatchSettings;
  label: string;
}

function KeyBindRow<Path extends TypedPaths<KeyBind | null>>({ path, useWatch, label }: KeyBindRowProps<Path>) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [locked, setLocked] = useState(false);
  const [keyBind, setKeyBind] = useWatch<Path, KeyBind | null>(path);
  const [override, setOverride] = useState<KeyBind | null>(null);
  
  const onClick = useCallback((ev: React.MouseEvent) => {
    if(locked) {
      setKeyBind(null);
      document.exitPointerLock();
    } else {
      ev.currentTarget.requestPointerLock();
    }
  }, [locked, setKeyBind]);
  
  const onKeyDown = useCallback((ev: React.KeyboardEvent) => {
    if(!locked) return;
    ev.preventDefault();
    setOverride({
      key: ev.key,
      code: ev.code,
      shift: ev.shiftKey,
      alt: ev.altKey,
      ctrl: ev.ctrlKey,
      meta: ev.metaKey,
    });
  }, [locked]);
  
  const onKeyUp = useCallback((ev: React.KeyboardEvent) => {
    if(!locked || !override) return;
    ev.preventDefault();
    
    setKeyBind(override);
    setOverride(null);
    document.exitPointerLock();
  }, [locked, override, setKeyBind]);
  
  useEffect(() => {
    const onLock = () => {
      if(buttonRef.current && buttonRef.current === document.pointerLockElement) {
        setLocked(true);
      } else {
        setLocked(false);
        setOverride(null);
      }
    };
    
    document.addEventListener("pointerlockchange", onLock);
    return () => document.removeEventListener("pointerlockchange", onLock);
  }, []);
  
  const current = override || keyBind;
  
  let text;
  if(!current) text = "None";
  else {
    if(current.key === "Control") text = "Ctrl";
    else if(current.key === "Meta") text = "Win";
    else text = current.key;
    
    if(current.alt && current.key !== "Alt") text = `Alt+${text}`;
    if(current.shift && current.key !== "Shift") text = `Shift+${text}`;
    if(current.ctrl && current.key !== "Control") text = `Ctrl+${text}`;
    if(current.meta && current.key !== "Meta") text = `Win+${text}`;
  }
  
  return (
    <Row>
      <Label>{label}</Label>
      <Button active={locked} onClick={onClick} onKeyDown={onKeyDown} onKeyUp={onKeyUp} ref={buttonRef}>{text}</Button>
    </Row>
  );
}

type TypedPaths<T> = NonNullable<{
  [P in keyof FlattenedSettings]: SettingsQuery<P> extends T ? P : never;
}[keyof FlattenedSettings]>;

const StyledModal = styled(Modal)`
  width: 20em;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ResetButton = styled(Button)`
  align-self: start;
`;

const Header = styled(Row)`
  margin-top: 1rem;
`;

const Label = styled.label`
  font-size: 75%;
`;
