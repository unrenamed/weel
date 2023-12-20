"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { classNames } from "@/components/utils";
import { useTheme } from "next-themes";

export default function HeaderLogo() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // When mounted on client, now we can start loading the image
  // This prevents an error when server HTML does not match client HTML after hydration
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{ width: 32, height: 32 }}
        className="rounded-full animate-pulse bg-gray-200 dark:bg-neutral-700"
      />
    );
  }

  return (
    <Image
      className={classNames(
        "rounded-full transition-all duration-75 ease-in-out",
        loading
          ? "bg-gray-200 dark:bg-neutral-700 animate-pulse"
          : "active:scale-95"
      )}
      src={`/_static/${theme === "dark" ? "light-logo" : "dark-logo"}.png`}
      alt="App logo"
      width={32}
      height={32}
      onLoad={() => setLoading(false)}
    />
  );
}
