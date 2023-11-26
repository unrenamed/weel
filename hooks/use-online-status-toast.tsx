import { usePrevious } from "./use-previous";
import { useOnlineStatus } from "./use-online-status";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const useOnlineStatusToast = () => {
  const isOnline = useOnlineStatus();
  const prevIsOnline = usePrevious(isOnline);
  const offlineToastId = useRef<string | number>();

  useEffect(() => {
    if (prevIsOnline === undefined || isOnline === prevIsOnline) return;

    if (isOnline) {
      toast.success("You are back online!", {
        duration: 3000,
        position: "bottom-left",
      });
    } else {
      offlineToastId.current = toast.warning("You are offline!", {
        description: "Changes made now will not be saved.",
        duration: Infinity,
        dismissible: false,
        position: "bottom-left",
      });
    }
    return () => {
      toast.dismiss(offlineToastId.current);
    };
  }, [isOnline, prevIsOnline]);
};
