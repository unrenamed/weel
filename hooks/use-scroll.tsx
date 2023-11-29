import { round } from "@/lib/utils";
import { MutableRefObject, useCallback, useEffect } from "react";

const options = {
  capture: false,
  passive: true,
};

export function useScroll(
  callback: (coords: { scrollX: number; scrollY: number }) => void,
  target?: MutableRefObject<Element | null | undefined> | null
) {
  const getPositions = useCallback(() => {
    const el = target ? target.current : document.documentElement;
    if (!el) return;

    return {
      x: round(el.scrollLeft / (el.scrollWidth - el.clientWidth), 2),
      y: round(el.scrollTop / (el.scrollHeight - el.clientHeight), 2),
    };
  }, [target]);

  const handleScrollEvent: EventListener = useCallback(() => {
    const newScrollValues = getPositions();
    if (!newScrollValues) return;

    const { x, y } = newScrollValues;
    callback({ scrollX: x, scrollY: y });
  }, [callback, getPositions]);

  useEffect(() => {
    const object = target ? target.current : document;
    if (!object) return;
    object.addEventListener("scroll", handleScrollEvent, options);
    return () =>
      object.removeEventListener("scroll", handleScrollEvent, options);
  }, [target, handleScrollEvent]);
}
