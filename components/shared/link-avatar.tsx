import { classNames } from "@/components/utils";
import { getApexDomain } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { avatarLoader, faviconLoader } from "@/lib/image-loaders";

export default function LinkAvatar({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const apexDomain = getApexDomain(url);
  const loaderOpts = { src: apexDomain, width: 32 };

  const src = isError ? avatarLoader(loaderOpts) : faviconLoader(loaderOpts);

  return (
    <Image
      src={src}
      alt={apexDomain}
      className={classNames(
        "h-8 w-8 rounded-full sm:h-10 sm:w-10 duration-700 ease-in-out",
        loading
          ? "scale-110 blur-sm grayscale bg-skeleton"
          : "scale-100 blur-0 grayscale-0"
      )}
      quality={100}
      width={32}
      height={32}
      onLoad={() => setLoading(false)}
      onError={() => setIsError(true)}
    />
  );
}
