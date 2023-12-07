import React from "react";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type ImmutableRef<T> = Readonly<React.MutableRefObject<T>>;

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// https://stackoverflow.com/questions/69843406/flattening-a-nested-object-in-typescript-whilst-preserving-types
export type Flatten<T extends object> = object extends T
  ? object
  : {
    [K in keyof T]-?: (x: NonNullable<T[K]> extends infer V
      ? V extends object
        ? V extends readonly any[]
          ? Pick<T, K>
          : Flatten<V> extends infer FV
            ? (T & {
              [P in keyof FV as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: FV[P]
            })
            : never
        : Pick<T, K>
      : never
    ) => void
  } extends Record<keyof T, (y: infer O) => void>
    ? O extends infer U
      ? { [K in keyof O]: O[K] }
      : never
    : never;
