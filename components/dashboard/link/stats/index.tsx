import { classNames } from "@/components/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Link } from "@prisma/client";
import { useState } from "react";

type Params = {
  link: Link;
};

export default function LinkStats({ link }: Params) {
  const [scrolled, setIsScrolled] = useState(false);
  useScroll(({ scrollY }) => setIsScrolled(scrollY > 0.1));

  return (
    <div className="w-full grid grid-cols-1 place-content-center py-3">
      <div
        className={classNames("sticky md:py-5 py-3 top-0 bg-gray-50 z-10", {
          "shadow-md": scrolled,
        })}
      >
        <div className="w-full max-w-4xl mx-auto px-3">
          <Header link={link} />
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto p-3">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

const Header = ({ link }: Params) => {
  const domainKey = `${link.domain}/${link.key}`;
  const href = `https://${domainKey}`;

  return (
    <div className="flex justify-between items-center">
      <a
        className="group flex text-lg font-semibold text-gray-800 md:text-xl"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {domainKey}
      </a>
    </div>
  );
};

const Card = () => {
  return (
    <div className="rounded-md py-5 px-7 shadow-md h-[400px] bg-white border-gray-200 overflow-auto">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-medium">Locations</h2>
        <div className="flex justify-between items-center gap-2">
          <button className="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition duration-75 active:scale-95 text-sm font-medium py-1 px-2">
            Device
          </button>
          <button className="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition duration-75 active:scale-95 text-sm font-medium py-1 px-2">
            Browser
          </button>
          <button className="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition duration-75 active:scale-95 text-sm font-medium py-1 px-2">
            OS
          </button>
        </div>
      </div>
    </div>
  );
};
