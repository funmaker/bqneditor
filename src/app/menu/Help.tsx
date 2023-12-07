import React from "react";
import styled from "styled-components";
import readme from "../../../README.md";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Markdown from "../../components/Markdown";

export default function Help() {
  return (
    <StyledModal trigger={<Button>Help</Button>}>
      <h2>Help</h2>
      <Markdown>
        {readme.split("<!-- HELP END -->")[0]}
      </Markdown>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  width: 40em;
`;
