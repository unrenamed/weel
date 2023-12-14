"use client";

import { useState } from "react";
import Image from "next/image";
import { classNames } from "@/components/utils";

export default function HeaderLogo() {
  const [loading, setLoading] = useState(true);

  return (
    <Image
      className={classNames(
        "rounded-full transition-all duration-75 ease-in-out",
        loading ? "bg-gray-200" : "active:scale-95"
      )}
      src="/_static/logo.png"
      alt="App logo"
      width={40}
      height={40}
      onLoad={() => setLoading(false)}
    />
  );
}
