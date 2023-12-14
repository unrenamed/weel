import { useSyncExternalStore } from "react";

export const useOnlineStatus = () => {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return isOnline;
};

const getSnapshot = () => navigator.onLine;

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

const subscribe = (callback: (ev: Event) => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};
