
export enum TokenType {
  UNUSED = "unused",
  FUNCTION = "function",
  MODIFIER = "modifier",
  MODIFIER_2 = "modifier2",
  GETS = "gets",
  SEPARATOR = "separator",
  VALUE = "value",
  PAREN = "paren",
  BRACE = "brace",
  LIGATURE = "ligature",
  HEAD = "head",
  BRACKET = "bracket",
  NOTHING = "nothing",
  NUMBER = "number",
  COMMENT = "comment",
  STRING = "string",
  NEW_LINE = "newLine",
}

interface Token {
  content: string;
  type: TokenType | null;
}

const tokenTests = [
  { test: "\n", type: TokenType.NEW_LINE },
  { test: /^\s+/u, type: null },
  { test: /^#[^\n]*/u, type: TokenType.COMMENT },
  { test: "+-×÷⋆√⌊⌈|¬∧∨<>≠=≤≥≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔!", type: TokenType.FUNCTION },
  { test: "˙˜˘¨⌜⁼´˝`", type: TokenType.MODIFIER },
  { test: "∘○⊸⟜⌾⊘◶⎉⚇⍟⎊", type: TokenType.MODIFIER_2 },
  { test: "𝕎𝕏𝔽𝔾𝕊", type: TokenType.FUNCTION },
  { test: "𝕨𝕩𝕗𝕘𝕤", type: TokenType.VALUE },
  { test: '·', type: TokenType.NOTHING },
  { test: '@', type: TokenType.STRING },
  { test: "←⇐↩", type: TokenType.GETS },
  { test: "⋄,", type: TokenType.SEPARATOR },
  { test: "()", type: TokenType.PAREN },
  { test: "{}", type: TokenType.BRACE },
  { test: ";:?", type: TokenType.HEAD },
  { test: "⟨⟩[]", type: TokenType.BRACKET },
  { test: "‿", type: TokenType.LIGATURE },
  { test: /^"[^"]*"/u, type: TokenType.STRING },
  { test: /^'[^']*'/u, type: TokenType.STRING },
  { test: /^_𝕣_/u, type: TokenType.MODIFIER_2 },
  { test: /^_𝕣/u, type: TokenType.MODIFIER },
  { test: /^𝕣/u, type: TokenType.VALUE },
  { test: /^•?_[a-zA-Z0-9_]+_/u, type: TokenType.MODIFIER_2 },
  { test: /^•?_[a-zA-Z0-9_]+/u, type: TokenType.MODIFIER },
  { test: /^•?[A-Z][a-zA-Z0-9_]*/u, type: TokenType.FUNCTION },
  { test: /^•?[a-z][a-zA-Z0-9_]*/u, type: TokenType.VALUE },
  { test: /^¯?(∞|(π|[0-9]+(\.[0-9]+)?)([eE]¯?[0-9]+)?)/u, type: TokenType.NUMBER },
];

function doTest(code: string, test: string | RegExp) {
  if(test instanceof RegExp) {
    const match = code.match(test);
    if(!match || match.index !== 0) return null;
    return match[0];
  } else {
    const char = code[Symbol.iterator]().next().value as string;
    if(test.includes(char)) return char;
  }
  
  return null;
}

export default function tokenize(code: string) {
  const tokens: Token[] = [];
  let pos = 0;
  
  outer: while(pos < code.length) {
    for(const desc of tokenTests) {
      const match = doTest(code.slice(pos), desc.test);
      if(match !== null) {
        tokens.push({
          content: match,
          type: desc.type,
        });
        
        pos += match.length;
        continue outer;
      }
    }
    
    if(pos < code.length) {
      tokens.push({
        content: code[pos],
        type: null,
      });
      pos += 1;
    }
  }
  
  const merged: Token[] = [];
  for(const token of tokens) {
    if(merged.length > 0 && token.type === merged[merged.length - 1].type && token.type !== TokenType.NEW_LINE) {
      merged[merged.length - 1].content += token.content;
    } else {
      merged.push(token);
    }
  }
  
  return merged;
}
