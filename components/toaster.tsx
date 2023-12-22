"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      theme={theme as "dark" | "light" | undefined}
      toastOptions={{ className: "!bg-content" }}
    />
  );
}
