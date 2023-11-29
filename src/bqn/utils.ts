
export interface ShapedArray<T> extends Omit<T[], "fill"> {
  fill: T;
  sh: number[];
}

export const isShapedNumArr = (arr: any): arr is ShapedArray<number> => Array.isArray(arr) && "fill" in arr && "sh" in arr && (arr.length === 0 || typeof arr[0] === "number");
