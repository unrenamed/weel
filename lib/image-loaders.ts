type LoaderProps = {
  src: string;
  width?: number;
};

export const faviconLoader = ({ src, width }: LoaderProps) => {
  return `https://payable-red-ostrich.faviconkit.com/${src}/${width}`;
};

export const avatarLoader = ({ src }: LoaderProps) => {
  return `https://avatar.vercel.sh/${src}`;
};

export const flagIconLoader = ({ src }: LoaderProps) => {
  return `https://flag.vercel.app/m/${src}.svg`;
};

export const deviceIconLoader = ({ src }: LoaderProps) => {
  return `https://uaparser.js.org/images/${src}.png`;
};
