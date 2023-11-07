import { useCallback, useRef, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import {
  QRCodeSVG,
  QRProps,
  buildQRCodeCanvas,
  buildQRCodeSVG,
  getPathToQRCodeImage,
} from "@/lib/qr";
import { Clipboard, ClipboardCheck, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Popover from "../shared/popover";

function LinkQrModalContent({ link }: { link: Link }) {
  const linkAppURL = `https://${link.domain}/${link.key}`;

  const qrData = {
    value: linkAppURL,
    bgColor: "#ffffff",
    fgColor: "#000000",
    size: 1024,
    level: "Q",
    imageSettings: {
      src: new URL("/_static/logo.png", window.location.origin).href,
      height: 256,
      width: 256,
      excavate: true,
    },
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-3">
      <h3 className="text-lg font-medium">Download QR code</h3>
      <div className="flex rounded-md border-2 border-gray-200 bg-white p-3">
        <QRCodeSVG
          value={qrData.value}
          size={qrData.size / 8}
          bgColor={qrData.bgColor}
          fgColor={qrData.fgColor}
          level={qrData.level}
          includeMargin={false}
          imageSettings={{
            ...qrData.imageSettings,
            height: qrData.imageSettings ? qrData.imageSettings.height / 8 : 0,
            width: qrData.imageSettings ? qrData.imageSettings.width / 8 : 0,
          }}
        />
      </div>
      <div className="flex space-x-3 items-center mb-3">
        <CopyToClipboardButton qrData={qrData} />
        <ExportDropdown
          qrData={qrData}
          exportFileName={`${link.key}-qr-code`}
        />
      </div>
    </div>
  );
}

function CopyToClipboardButton({ qrData }: { qrData: QRProps }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyQRCode = async () => {
    const canvas = await buildQRCodeCanvas(qrData);
    canvas.toBlob(
      function copyToClipboard(blob) {
        if (!blob) throw new Error();
        const item = new ClipboardItem({ [blob.type]: blob });
        navigator.clipboard
          .write([item])
          .then(() => setIsCopied(true))
          .then(() => setTimeout(() => setIsCopied(false), 2500));
      },
      "image/png",
      1
    );
  };

  return (
    <button
      onClick={async () => {
        if (isCopied) return;
        toast.promise(copyQRCode(), {
          loading: "Copying QR code to clipboard...",
          success: "Copied QR code to clipboard!",
          error: "Failed to copy",
        });
      }}
      className="w-full flex items-center justify-center gap-2 rounded-md border border-black bg-black px-5 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
    >
      {isCopied ? (
        <>
          <ClipboardCheck className="h-4 w-4" />
          <p>Copied</p>
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
          <p>Copy</p>
        </>
      )}
    </button>
  );
}

function ExportDropdown({
  exportFileName,
  qrData,
}: {
  exportFileName: string;
  qrData: QRProps;
}) {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const download = (url: string, extension: string) => {
    if (!downloadAnchorRef.current) return;
    downloadAnchorRef.current.href = url;
    downloadAnchorRef.current.download = `${exportFileName}.${extension}`;
    downloadAnchorRef.current.click();
  };

  return (
    <div>
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={(open) => {
          setIsPopoverOpen(open);
        }}
        content={
          <div className="flex flex-col p-2 sm:w-36 text-gray-500 text-sm font-medium pointer-events-auto">
            <button
              onClick={() => download(buildQRCodeSVG(qrData), "svg")}
              className="p-2 flex items-center rounded-md transition-all duration-75 hover:bg-gray-100"
            >
              <ImageIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
              SVG
            </button>
            <button
              onClick={async () =>
                download(await getPathToQRCodeImage(qrData, "image/png"), "png")
              }
              className="p-2 flex items-center rounded-md transition-all duration-75 hover:bg-gray-100"
            >
              <ImageIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
              PNG
            </button>
            <button
              onClick={async () =>
                download(
                  await getPathToQRCodeImage(qrData, "image/jpeg"),
                  "jpg"
                )
              }
              className="p-2 flex items-center rounded-md transition-all duration-75 hover:bg-gray-100"
            >
              <ImageIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
              JPEG
            </button>
          </div>
        }
      >
        <button className="w-full flex items-center justify-center gap-2 rounded-md border border-black bg-black px-5 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black">
          <Download className="h-4 w-4" />
          Export
        </button>
      </Popover>
      <a ref={downloadAnchorRef} className="hidden" />
    </div>
  );
}

export const useLinkQrModal = (link: Link) => {
  const { show, hide, isOpen, Modal: LinkQrModal } = useModal();

  const Modal = useCallback(() => {
    return (
      <LinkQrModal>
        <LinkQrModalContent link={link} />
      </LinkQrModal>
    );
  }, [LinkQrModal, link]);

  return {
    show,
    hide,
    isOpen,
    Modal,
  };
};
