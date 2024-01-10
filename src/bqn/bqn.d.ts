
interface BQN {
  (code: string): any;
  compile(code: string): any;
  fmt(x: any): string;
  fmtErr(err: any): string;
  sysargs: any;
  sysvals: Record<string, any>;
  util: {
    has: (raw: any) => boolean;
    list: (array: any[], fill?: any) => any;
    str: (text: string) => any;
    unstr: (raw: any) => string;
    dynsys: (fn: (state: any) => any) => (state: any) => any;
    req1str: (name: string, x: any, w: any) => string;
    makens: (keys: string[], vals: any) => any;
  };
}

const bqn: BQN;
export default bqn;
