import React from "react";

interface ExLinkProps extends React.ComponentProps<"a"> {
  to: string;
}

export default function ExLink({ to, ...rest }: ExLinkProps) {
  return <a target="_blank" rel="noopener noreferrer" href={to} {...rest} />;
}
