import { useCallback, useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query]
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false; // Media query should not run for server-generated HTML
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
