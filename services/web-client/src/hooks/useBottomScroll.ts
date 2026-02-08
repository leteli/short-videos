import { useRef, useEffect, useCallback, useMemo } from "react";

interface IProps<T> {
  rootRef: (data: HTMLElement) => void;
  items: T[];
  getId: (el: T) => string;
  isMine?: (el: T) => boolean;
}

export const useBottomScroll = <T>({ rootRef, items, getId, isMine }: IProps<T>) => {
  const scrollableRootRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const firstLoadRef = useRef<boolean>(true);
  const prevEdgeRef = useRef<{ first?: string; last?: string; len: number }>({
    len: 0,
  });
  const lastScrollDistanceToBottomRef = useRef<number>(0);

  const rootRefSetter = useCallback(
    (node: HTMLDivElement) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef],
  );

  const isNearBottom = (el: HTMLElement, threshold = 80) =>
    el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const el = scrollableRootRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };


  useEffect(() => {
    const el = scrollableRootRef.current;
    if (!el || items.length === 0) return;

    const firstId = getId(items[0]);
    const lastId = getId(items[items.length - 1]);

    const prev = prevEdgeRef.current;

    const isFirstLoad = firstLoadRef.current;

    const appended =
      prev.len > 0 &&
      prev.last &&
      prev.last !== lastId &&
      prev.first === firstId;

    const prepended =
      prev.len > 0 &&
      prev.first &&
      prev.first !== firstId &&
      prev.last === lastId;

    if (isFirstLoad) {
      scrollToBottom("auto");
      firstLoadRef.current = false;
    } else if (appended) {
      const mine = isMine?.(items[items.length - 1]) ?? false;
      if (mine || shouldAutoScrollRef.current) {
        scrollToBottom("smooth");
      }
    } else if (prepended) {
      el.scrollTop = el.scrollHeight - lastScrollDistanceToBottomRef.current;
    }

    prevEdgeRef.current = { first: firstId, last: lastId, len: items.length };
  }, [items, isMine]);

  const handleScroll = useCallback(() => {
    const el = scrollableRootRef.current;
    if (!el) return;
    lastScrollDistanceToBottomRef.current = el.scrollHeight - el.scrollTop;
    shouldAutoScrollRef.current = isNearBottom(el);
  }, []);

  useEffect(() => {
    if (!scrollableRootRef.current) return;
    if (shouldAutoScrollRef.current) {
      scrollToBottom("auto");
    }
  }, [items.length]);
  return { rootRefSetter, handleScroll };
};
