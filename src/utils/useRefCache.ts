import { useRef } from "react";

export function useRefCache<T>(data: T) {
  const ref = useRef(data);
  ref.current = data;
  return ref;
}
