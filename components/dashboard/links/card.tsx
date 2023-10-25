import ThreeDots from "@/components/icons/three-dots";
import BlurImage from "@/components/shared/blur-image";
import Popover from "@/components/shared/popover";
import { formatDate, capitalize, getApexDomain } from "@/lib/utils";
import { Link } from "@prisma/client";
import { Archive, BarChart, Edit3, QrCode, Trash2 } from "lucide-react";
import { useEffect } from "react";

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `https://api.faviconkit.com/${src}/${width}`;
};
const fallbackImageLoader = ({
  src,
  width: _,
}: {
  src: string;
  width: number;
}) => {
  return `https://avatar.vercel.sh/${src}`;
};

export default function LinkCard({ link }: { link: Link }) {
  const domainKey = `${link.domain}/${link.key}`;
  const href = `https://${domainKey}`;
  const apexDomain = getApexDomain(link.url);

  const onKeyDown = (event: Event) => {
    if (!(event instanceof KeyboardEvent)) return;    
    if (!["q", "d", "e", "a"].includes(event.key)) return;

    event.preventDefault();

    switch (event.key) {
      case "e":
        console.log("E");
        break;
      case "q":
        console.log("Q");
        break;
      case "a":
        console.log("A");
        break;
      case "d":
        console.log("D");
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex justify-between items-center rounded-lg bg-white p-3 shadow transition-all hover:shadow-md sm:p-4">
      <div className="flex gap-3 items-center">
        <BlurImage
          src={apexDomain}
          loader={imageLoader}
          fallbackLoader={fallbackImageLoader}
          alt={apexDomain}
          className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
          width={32}
          height={32}
        />
        <div>
          <div className="flex items-center">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-blue-800 font-semibold"
            >
              {domainKey}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {capitalize(formatDate(link.createdAt))}
            </p>
            <p className="hidden xs:block">•</p>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="truncate md:max-w-[450px] sm:max-w-[300px] max-w-[150px] hover:underline font-medium text-gray-700 text-sm"
            >
              {link.url}
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <a
          onClick={(e) => e.stopPropagation()}
          href={`/links/${encodeURIComponent(link.key)}`}
          className="flex items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100 text-gray-500"
        >
          <BarChart strokeWidth={1.5} className="h-4 w-4" />
          <p className="whitespace-nowrap text-sm text-gray-500">
            {link.totalClicks}
            <span className="ml-1 hidden sm:inline-block">clicks</span>
          </p>
        </a>
        <Popover
          align="end"
          content={
            <div className="flex flex-col items-center p-2 sm:w-48">
              <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75">
                <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium">
                  <Edit3 strokeWidth={1.5} className="h-4 w-4" />
                  <span>Edit</span>
                </div>
                <kbd className="text-gray-500 bg-gray-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  E
                </kbd>
              </button>
              <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75">
                <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium ">
                  <QrCode strokeWidth={1.5} className="h-4 w-4" />
                  <span>QR Code</span>
                </div>
                <kbd className="text-gray-500 bg-gray-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  Q
                </kbd>
              </button>
              <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75">
                <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium ">
                  <Archive strokeWidth={1.5} className="h-4 w-4" />
                  <span>Archive</span>
                </div>
                <kbd className="text-gray-500 bg-gray-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  A
                </kbd>
              </button>
              <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75">
                <div className="flex items-center space-x-2 text-red-600 text-sm font-medium ">
                  <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                  <span>Delete</span>
                </div>
                <kbd className="text-red-600 bg-red-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  D
                </kbd>
              </button>
            </div>
          }
        >
          <button className="m-0 px-1 py-2 rounded-md hover:bg-gray-100 active:bg-gray-200">
            <ThreeDots className="h-5 w-5" />
          </button>
        </Popover>
      </div>
    </div>
  );
}
