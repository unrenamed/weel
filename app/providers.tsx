"use client";

import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Theme>{children}</Theme>
    </ThemeProvider>
  );
}
