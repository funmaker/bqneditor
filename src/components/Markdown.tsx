/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import MarkdownBase, { MarkdownToJSX } from 'markdown-to-jsx';
import styled from "styled-components";
import Code from "../app/editor/Code";

export type MarkdownProps = React.ComponentProps<typeof MarkdownBase>;

export default function Markdown({ options, children, ...rest }: MarkdownProps) {
  const optionsEx = useMemo<MarkdownToJSX.Options>(() => ({
    forceWrapper: true,
    overrides: {
      h1: { component: "h4" },
      h2: { component: "h5" },
      h3: { component: "h6" },
      code: { component: Code, props: { inline: true } },
      ...options?.overrides,
    },
    ...options,
  }), [options]);
  
  return <StyledMarkdown options={optionsEx} {...rest}>{children}</StyledMarkdown>;
}

const StyledMarkdown = styled(MarkdownBase)`
  ul {
    margin-left: 1.35em;
    font-size: 75%;
    font-family: sans-serif;
  }
  
  p {
    margin-bottom: 0.5em;
    font-size: 75%;
    font-family: sans-serif;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
  
  h1 {
    margin-bottom: 0.5rem;
  }
  
  h4 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
`;
