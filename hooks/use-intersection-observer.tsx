import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useIntersectionObserver<E extends Element>(
  options: IntersectionObserverInit = {},
  elementRef?: RefObject<E>
): [(node: E) => void, IntersectionObserverEntry | null] {
  const { threshold = 0, root = null, rootMargin = "0px" } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const previousObserver = useRef<IntersectionObserver | null>(null);

  const customRef = useCallback(
    (node: E) => {
      if (previousObserver.current) {
        previousObserver.current.disconnect();
        previousObserver.current = null;
      }

      const observerParams = { threshold, root, rootMargin };
      const observer = new IntersectionObserver(([entry]) => {
        setEntry(entry);
      }, observerParams);

      observer.observe(node);
      previousObserver.current = observer;
    },
    [root, rootMargin, threshold]
  );

  useEffect(() => {
    if (elementRef?.current) customRef(elementRef?.current);
    return () => previousObserver.current?.disconnect();
  }, [elementRef, customRef]);

  return [customRef, entry];
}
