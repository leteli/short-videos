import { DependencyList, useEffect } from 'react';

import { useFirstMountState } from './useFirstMountState';

import { useTimeoutFn } from './useTimeoutFn';

export type UseDebounceReturn = {
  cancel: () => void;
};

export const useDebounce = (
  fn: (...args: unknown[]) => unknown,
  ms = 0,
  deps: DependencyList = [],
): UseDebounceReturn => {
  const { onStop, onStart } = useTimeoutFn(fn, ms);

  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      onStart();
    }
  }, deps);

  return {
    cancel: onStop,
  };
};
