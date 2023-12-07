import { useContext, useMemo, useState } from "react";
import { BQNOutput } from "../bqn/output";
import { AppOutputState, OutputContext } from "./useApp";
import { useRefCache } from "./useRefCache";

export { BQNOutput };

export default function useOutput() {
  const output = useContext(OutputContext);
  if(!output) throw new Error("useOutput can't be used outside of OutputContext");
  return output;
}

export function useOutputState(): [BQNOutput[], AppOutputState] {
  const [outputs, setOutputs] = useState<BQNOutput[]>([]);
  const outputRef = useRefCache(outputs);
  
  const state = useMemo<AppOutputState>(() => ({
    append: (output: BQNOutput) => setOutputs(outputs => [...outputs, output]),
    clear: () => setOutputs([]),
    useWatch: useOutput,
    ref: outputRef,
  }), [outputRef]);
  
  return [outputs, state];
}
