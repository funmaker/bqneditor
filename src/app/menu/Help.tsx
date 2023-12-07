import React from "react";
import styled from "styled-components";
import readme from "../../../README.md";
import packageJson from "../../../package.json";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Markdown from "../../components/Markdown";

export default function Help() {
  return (
    <StyledModal trigger={<Button>Help</Button>}>
      <StyledHeader>Help</StyledHeader>
      <Version>
        Editor version: <b>{packageJson.version}</b>
      </Version>
      <Markdown>
        {readme.split(/<!-- HELP .* -->/)[1]}
      </Markdown>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  width: 40em;
`;

const StyledHeader = styled.h2`
  margin-bottom: 0.5rem;
`;

const Version = styled.p`
  font-family: sans-serif;
  margin-bottom: 0.5rem;
  font-size: 75%;
`;
