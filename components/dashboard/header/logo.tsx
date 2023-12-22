"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { classNames } from "@/components/utils";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks";

export default function HeaderLogo() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  // When mounted on client, now we can start loading the image
  // This prevents an error when server HTML does not match client HTML after hydration
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="rounded-full animate-pulse bg-skeleton w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]" />
    );
  }

  return (
    <Image
      className={classNames(
        "rounded-full transition-all duration-75 ease-in-out",
        loading ? "bg-skeleton animate-pulse" : "active:scale-95"
      )}
      src={`/_static/${theme === "dark" ? "light-logo" : "dark-logo"}.png`}
      alt="App logo"
      width={isMobile ? 32 : 40}
      height={isMobile ? 32 : 40}
      onLoad={() => setLoading(false)}
    />
  );
}
