
const context = require.context("../examples", true, /\.bqn$/);
const files = context.keys().map<[string, string]>(path => [path, context(path).default]);

export interface Directory {
  [path: string]: string | Directory;
}

let examples: Directory = {};

for(const [path, file] of files) {
  const parts = path.split("/");
  const filename = parts.pop();
  if(!filename) continue;
  
  let cursor = examples;
  
  for(const part of parts) {
    if(part === ".") continue;
    if(typeof cursor[part] !== "object") cursor[part] = {};
    
    cursor = cursor[part] as Directory;
  }
  
  cursor[filename] = file;
}

function sort(examples: Directory) {
  for(const key in examples) {
    const value = examples[key];
    if(typeof value === "object") examples[key] = sort(value);
  }
  
  return Object.fromEntries(
    Object.entries(examples)
          .sort(([aKey, aValue], [bKey, bValue]) => (
            +(typeof aValue === "string") - +(typeof bValue === "string")
            || aKey.localeCompare(bKey)
          )),
  );
}

examples = sort(examples);

export default examples;
