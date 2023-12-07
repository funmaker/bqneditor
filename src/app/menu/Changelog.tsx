import React from "react";
import styled from "styled-components";
import changelog from "../../../CHANGELOG.md";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Markdown from "../../components/Markdown";

export default function Changelog() {
  return (
    <StyledModal trigger={<Button>Changelog</Button>}>
      <h2>Change Log</h2>
      <Markdown>
        {changelog.split("<!-- TODO END -->").at(-1)!}
      </Markdown>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  width: 40em;
`;
