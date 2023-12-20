import { ReactNode, useCallback, useRef, useState } from "react";
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
import { ButtonWithIcon, Popover } from "../shared";
import { useCopyToClipboard } from "@/hooks";

function LinkQrModalContent({ link }: { link: Link }) {
  const linkAppURL = `https://${link.domain}/${link.key}`;

  const qrData = {
    value: linkAppURL,
    bgColor: "#ffffff",
    fgColor: "#000000",
    size: 1024,
    level: "Q",
    imageSettings: {
      src: new URL("/_static/dark-logo.png", window.location.origin).href,
      height: 256,
      width: 256,
      excavate: true,
    },
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-5">
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
  const [copied, copyToClipboard] = useCopyToClipboard(2500);

  const copyQRCode = async () => {
    const canvas = await buildQRCodeCanvas(qrData);
    canvas.toBlob(
      function copy(blob) {
        if (!blob) throw new Error();
        const item = new ClipboardItem({ [blob.type]: blob });
        copyToClipboard(item);
      },
      "image/png",
      1
    );
  };

  return (
    <ButtonWithIcon
      text={copied ? "Copied" : "Copy"}
      icon={
        copied ? (
          <ClipboardCheck strokeWidth={1.5} className="h-4 w-4" />
        ) : (
          <Clipboard strokeWidth={1.5} className="h-4 w-4" />
        )
      }
      className="w-32 px-5 py-1.5 font-normal"
      onClick={async () => {
        if (copied) return;
        toast.promise(copyQRCode(), {
          loading: "Copying QR code to clipboard...",
          success: "Copied QR code to clipboard!",
          error: "Failed to copy",
        });
      }}
    />
  );
}

const exportOptions = [
  {
    text: "SVG",
    fileExtension: "svg",
    getImage: (qrData: QRProps) => buildQRCodeSVG(qrData),
  },
  {
    text: "PNG",
    fileExtension: "png",
    getImage: async (qrData: QRProps) =>
      getPathToQRCodeImage(qrData, "image/png"),
  },
  {
    text: "JPEG",
    fileExtension: "jpg",
    getImage: async (qrData: QRProps) =>
      getPathToQRCodeImage(qrData, "image/jpeg"),
  },
];

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
            {exportOptions.map(({ text, fileExtension, getImage }) => (
              <ExportOption
                key={text}
                text={text}
                icon={<ImageIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />}
                onClick={async () =>
                  download(await getImage(qrData), fileExtension)
                }
              />
            ))}
          </div>
        }
      >
        <ButtonWithIcon
          text="Export"
          icon={<Download className="h-4 w-4" />}
          className="w-32 px-5 py-1.5 font-normal"
        />
      </Popover>
      <a ref={downloadAnchorRef} className="hidden" />
    </div>
  );
}

function ExportOption({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-2 flex items-center rounded-md transition-all duration-75 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-gray-200"
    >
      {icon}
      {text}
    </button>
  );
}

export const useLinkQrModal = ({ link }: { link: Link }) => {
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
