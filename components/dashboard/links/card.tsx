import ThreeDots from "@/components/icons/three-dots";
import {
  useArchiveLinkModal,
  useDeleteLinkModal,
  useLinkQrModal,
} from "@/components/modals";
import BlurImage from "@/components/shared/blur-image";
import Popover from "@/components/shared/popover";
import { formatDate, capitalize, getApexDomain } from "@/lib/utils";
import { Link } from "@prisma/client";
import * as Separator from "@radix-ui/react-separator";
import {
  Archive,
  ArchiveIcon,
  ArchiveRestore,
  BarChart,
  Check,
  Copy,
  Edit3,
  QrCode,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `https://payable-red-ostrich.faviconkit.com/${src}/${width}`;
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

export default function LinkCard({
  link,
  revalidate,
}: {
  link: Link;
  revalidate: () => void;
}) {
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const closeActionsMenu = () => setIsActionsMenuOpen(false);

  const { show: showArchiveModal, Modal: ArchiveModal } = useArchiveLinkModal(
    link,
    revalidate
  );
  const { show: showDeleteModal, Modal: DeleteModal } = useDeleteLinkModal(
    link,
    revalidate
  );
  const { show: showLinkQrModal, Modal: LinkQrModal } = useLinkQrModal(link);

  const domainKey = `${link.domain}/${link.key}`;
  const href = `https://${domainKey}`;
  const apexDomain = getApexDomain(link.url);

  const onKeyDown = useCallback(
    (event: Event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (!["q", "d", "e", "a"].includes(event.key)) return;
      if (!isActionsMenuOpen) return;

      event.preventDefault();

      setIsActionsMenuOpen(false);

      switch (event.key) {
        case "e":
          break;
        case "q":
          showLinkQrModal();
          break;
        case "a":
          showArchiveModal();
          break;
        case "d":
          showDeleteModal();
          break;
      }
    },
    [showArchiveModal, showDeleteModal, showLinkQrModal, isActionsMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div className="flex justify-between items-center rounded-lg bg-white p-3 shadow transition-all hover:shadow-md sm:p-4">
      <ArchiveModal />
      <DeleteModal />
      <LinkQrModal />
      <div className="flex gap-3 items-center">
        {link.archived ? (
          <div className="h-8 w-8 rounded-full sm:h-10 sm:w-10 bg-gray-200 flex items-center justify-center">
            <ArchiveIcon className="h-6 w-6 text-gray-400" />
          </div>
        ) : (
          <BlurImage
            src={apexDomain}
            loader={imageLoader}
            fallbackLoader={fallbackImageLoader}
            alt={apexDomain}
            className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
            width={32}
            height={32}
          />
        )}
        <div>
          <div className="flex items-center space-x-2">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`${
                link.archived ? "text-gray-500" : "text-blue-800"
              } font-semibold`}
            >
              {domainKey}
            </a>
            <CopyToClipboard value={domainKey} />
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
          isOpen={isActionsMenuOpen}
          onOpenChange={setIsActionsMenuOpen}
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
              <button
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75"
                onClick={() => {
                  closeActionsMenu();
                  showLinkQrModal();
                }}
              >
                <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium ">
                  <QrCode strokeWidth={1.5} className="h-4 w-4" />
                  <span>QR Code</span>
                </div>
                <kbd className="text-gray-500 bg-gray-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  Q
                </kbd>
              </button>
              <Separator.Root className="bg-gray-200 h-px w-full px-2 my-2" />
              <button
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75"
                onClick={() => {
                  closeActionsMenu();
                  showArchiveModal();
                }}
              >
                <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium ">
                  {link.archived ? (
                    <ArchiveRestore strokeWidth={1.5} className="h-4 w-4" />
                  ) : (
                    <Archive strokeWidth={1.5} className="h-4 w-4" />
                  )}
                  <span>{link.archived ? "Unarchive" : "Archive"}...</span>
                </div>
                <kbd className="text-gray-500 bg-gray-100 transition-all duration-75 px-1 py-0.5 rounded text-xs">
                  A
                </kbd>
              </button>
              <button
                className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100  transition-all duration-75"
                onClick={() => {
                  closeActionsMenu();
                  showDeleteModal();
                }}
              >
                <div className="flex items-center space-x-2 text-red-600 text-sm font-medium ">
                  <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                  <span>Delete...</span>
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

function CopyToClipboard({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="h-6 w-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 hover:scale-110 transition-all duration-75 active:scale-90"
      onClick={(event) => {
        event.stopPropagation();
        toast.promise(
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .then(() => setTimeout(() => setCopied(false), 3000)),
          {
            loading: "Copying link to clipboard...",
            success: "Copied link to clipboard!",
            error: "Failed to copy",
          }
        );
      }}
    >
      {copied ? (
        <Check className="h-3 w-3 m-auto" strokeWidth={1.5} />
      ) : (
        <Copy className="h-3 w-3 m-auto" strokeWidth={1.5} />
      )}
    </button>
  );
}
