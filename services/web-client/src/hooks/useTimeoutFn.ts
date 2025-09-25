import { useCallback, useEffect, useRef } from 'react';

export type UseTimeoutFnReturn = {
  onStop: () => void;
  onStart: () => void;
};

export const useTimeoutFn = (
  fn: (...args: unknown[]) => unknown,
  ms = 0,
): UseTimeoutFnReturn => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(fn);

  const set = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, []);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => () => clear(), []);

  return {
    onStop: clear,
    onStart: set,
  };
};
