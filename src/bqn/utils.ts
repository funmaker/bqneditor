
export interface ShapedArray<T> extends Omit<T[], "fill"> {
  fill: T;
  sh: number[];
}

export const isShapedArr = (arr: any): arr is ShapedArray<any> => Array.isArray(arr) && "fill" in arr && "sh" in arr;
export const isShapedNumArr = (arr: any): arr is ShapedArray<number> => isShapedArr(arr) && arr.every(el => typeof el === "number");
