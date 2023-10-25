import Image, { ImageLoader, ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallbackLoader?: ImageLoader;
};

type LoaderType = "default" | "fallback";

export default function BlurImage(props: Props) {
  const { className: _, ...imageProps } = props;

  const [isLoading, setLoading] = useState(true);
  const [loaderType, setLoaderType] = useState<LoaderType>("default");

  let loader = undefined;
  if (loaderType === "default") loader = props.loader;
  if (loaderType === "fallback") loader = props.fallbackLoader;

  return (
    <div className={props.className}>
      <Image
        {...imageProps}
        alt={props.alt}
        loader={loader}
        className={`duration-700 ease-in-out ${
          isLoading
            ? "scale-110 blur-sm grayscale"
            : "scale-100 blur-0 grayscale-0"
        } ${props.className}`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setLoaderType("fallback")}
      />
    </div>
  );
}
