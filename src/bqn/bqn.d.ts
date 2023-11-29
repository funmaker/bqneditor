
interface BQN {
  (code: string): any;
  compile(code: string): any;
  fmt(x: any): string;
  fmtErr(err: any): string;
  sysargs: any;
  sysvals: Record<string, any>;
  util: {
    str: (text: string) => any;
  };
}

const bqn: BQN;
export default bqn;
