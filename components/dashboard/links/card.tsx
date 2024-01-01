import { ThreeDots } from "@/components/icons";
import {
  useArchiveLinkModal,
  useDeleteLinkModal,
  useLinkQrModal,
  useCreateEditLinkModal,
  useChangeLinkPasswordModal,
} from "@/components/modals";
import { LinkAvatar, Popover, Tooltip } from "@/components/shared";
import { cn } from "@/components/utils";
import {
  dateTimeAgo,
  capitalize,
  pluralize,
  pluralizeJSX,
  dateTimeSoon,
  nFormatter,
} from "@/lib/utils";
import * as Separator from "@radix-ui/react-separator";
import NextLink from "next/link";
import {
  Archive,
  ArchiveIcon,
  ArchiveRestore,
  BarChart,
  CalendarClock,
  Check,
  Copy,
  Edit3,
  KeyRound,
  PlusSquare,
  QrCode,
  Trash2,
} from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { differenceInHours, isAfter } from "date-fns";
import { useCopyToClipboard, useIntersectionObserver } from "@/hooks";
import { TLink } from "@/lib/types";

type LinkCardProps = {
  link: TLink;
  onArchive: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
};

function LinkCard({
  link,
  onArchive,
  onDelete,
  onEdit,
  onDuplicate,
}: LinkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [_, entry] = useIntersectionObserver<HTMLDivElement>({}, cardRef);
  const isCardInViewport = !!entry?.isIntersecting;

  const [isCardSelected, setIsCardSelected] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const closeActionsMenu = () => setIsActionsMenuOpen(false);

  const { show: showLinkQrModal, Modal: LinkQrModal } = useLinkQrModal({
    link,
  });
  const { show: showArchiveModal, Modal: ArchiveModal } = useArchiveLinkModal({
    link,
    onSubmit: onArchive,
  });
  const { show: showDeleteModal, Modal: DeleteModal } = useDeleteLinkModal({
    link,
    onSubmit: onDelete,
  });
  const { show: showEditModal, Modal: EditModal } = useCreateEditLinkModal({
    link,
    mode: "edit",
    onSubmit: onEdit,
  });
  const { show: showDuplicateModal, Modal: DuplicateModal } =
    useCreateEditLinkModal({
      link: { ...link, key: `${link.key}-copy` },
      onSubmit: onDuplicate,
    });
  const { show: showChangeLinkPasswordModal, Modal: ChangeLinkPasswordModal } =
    useChangeLinkPasswordModal({
      link,
    });

  const domainKey = `${link.domain}/${link.key}`;
  const href = `https://${domainKey}`;

  const onKeyDown = useCallback(
    (event: Event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (!["q", "d", "e", "a", "x", "p"].includes(event.key)) return;
      if (!isCardSelected && !isActionsMenuOpen) return;

      event.preventDefault();

      setIsActionsMenuOpen(false);
      setIsCardSelected(false);

      switch (event.key) {
        case "e":
          showEditModal();
          break;
        case "d":
          showDuplicateModal();
          break;
        case "q":
          showLinkQrModal();
          break;
        case "a":
          showArchiveModal();
          break;
        case "x":
          showDeleteModal();
          break;
        case "p":
          showChangeLinkPasswordModal();
          break;
      }
    },
    [
      showArchiveModal,
      showDeleteModal,
      showLinkQrModal,
      showEditModal,
      showDuplicateModal,
      showChangeLinkPasswordModal,
      isActionsMenuOpen,
      isCardSelected,
    ]
  );

  const onCardClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element;
      const isCardDescendantClicked = cardRef.current?.contains(target);

      const isReactiveElement =
        target.tagName.toLowerCase() === "img" ||
        target.tagName.toLowerCase() === "div" ||
        target.tagName.toLowerCase() === "p";

      if (isCardDescendantClicked && isReactiveElement) {
        setIsCardSelected(!isCardSelected);
      } else {
        setIsCardSelected(false);
      }
    },
    [isCardSelected, setIsCardSelected]
  );

  useEffect(() => {
    if (isCardInViewport) {
      document.addEventListener("click", onCardClick);
    }
    return () => document.removeEventListener("click", onCardClick);
  }, [isCardInViewport, onCardClick]);

  useEffect(() => {
    if (isCardInViewport) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isCardInViewport, onKeyDown]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative transition-all duration-75",
        isCardSelected &&
          "before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-full before:bg-gradient-to-r before:from-link-card-backlight-from before:to-link-card-backlight-to sm:before:blur-[7px] before:blur-[5px]"
      )}
    >
      <div className="relative z-10 flex justify-between items-center rounded-lg bg-content p-3 shadow transition-all hover:shadow-md sm:p-4">
        {isCardInViewport && (
          <>
            <ArchiveModal />
            <DeleteModal />
            <LinkQrModal />
            <EditModal />
            <DuplicateModal />
            {link.hasPassword && <ChangeLinkPasswordModal />}
          </>
        )}
        <div className="flex gap-3 items-center">
          {link.archived ? (
            <div className="h-8 w-8 rounded-full sm:h-10 sm:w-10 bg-border flex items-center justify-center">
              <ArchiveIcon className="h-6 w-6 text-secondary" />
            </div>
          ) : (
            <LinkAvatar url={link.url} />
          )}
          <div>
            <div className="flex items-center space-x-3 max-w-fit">
              <a
                href={href}
                title={href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "w-full truncate font-semibold text-sm sm:text-base",
                  "max-w-[140px] sm:max-w-[300px] md:max-w-[360px] xl:max-w-[400px]",
                  link.archived ? "text-secondary" : "text-link"
                )}
              >
                {domainKey}
              </a>
              <CopyToClipboard value={domainKey} />
              {!!link.expiresAt && (
                <ExpirationWarning expiresAt={link.expiresAt} />
              )}
            </div>
            <div className="flex items-center space-x-2 max-w-[140px] sm:max-w-[300px] md:max-w-[360px] xl:max-w-[400px]">
              <p className="text-sm text-secondary whitespace-nowrap">
                {capitalize(dateTimeAgo(link.createdAt))}
              </p>
              <p className="hidden xs:block">•</p>
              <a
                href={link.url}
                title={link.url}
                target="_blank"
                rel="noreferrer"
                className="xs:block hidden truncate text-sm font-medium underline-offset-2 hover:underline"
              >
                {link.url}
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip
            content={
              <LinkTotalClicks
                totalClicks={link.totalClicks}
                lastClicked={link.lastClicked}
              />
            }
          >
            <NextLink
              onClick={(e) => e.stopPropagation()}
              href={`/analytics?domain=${link.domain}&key=${link.key}`}
              className="flex items-center space-x-1 rounded-md bg-skeleton/70 text-primary/85 px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100"
            >
              <BarChart strokeWidth={1.5} className="h-4 w-4" />
              {pluralizeJSX(
                (count, noun) => (
                  <span className="whitespace-nowrap text-sm ">
                    {nFormatter(count)}
                    <span className="ml-1 hidden sm:inline-block">{noun}</span>
                  </span>
                ),
                link.totalClicks,
                "click"
              )}
            </NextLink>
          </Tooltip>
          <Popover
            align="end"
            isOpen={isActionsMenuOpen}
            onOpenChange={setIsActionsMenuOpen}
            content={
              <div className="flex flex-col items-center p-2 sm:w-48">
                <PopoverItem
                  text="Edit"
                  kbd="e"
                  icon={<Edit3 strokeWidth={1.5} className="h-4 w-4" />}
                  onClick={() => {
                    closeActionsMenu();
                    showEditModal();
                  }}
                />
                <PopoverItem
                  text="Duplicate"
                  kbd="d"
                  icon={<PlusSquare strokeWidth={1.5} className="h-4 w-4" />}
                  onClick={() => {
                    closeActionsMenu();
                    showDuplicateModal();
                  }}
                />
                <PopoverItem
                  text="QR Code"
                  kbd="q"
                  icon={<QrCode strokeWidth={1.5} className="h-4 w-4" />}
                  onClick={() => {
                    closeActionsMenu();
                    showLinkQrModal();
                  }}
                />
                {link.hasPassword && (
                  <PopoverItem
                    text="Password"
                    kbd="p"
                    icon={<KeyRound strokeWidth={1.5} className="h-4 w-4" />}
                    onClick={() => {
                      closeActionsMenu();
                      showChangeLinkPasswordModal();
                    }}
                  />
                )}
                <Separator.Root className="bg-skeleton h-px w-full px-2 my-2" />
                <PopoverItem
                  text={link.archived ? "Unarchive" : "Archive"}
                  kbd="a"
                  icon={
                    link.archived ? (
                      <ArchiveRestore strokeWidth={1.5} className="h-4 w-4" />
                    ) : (
                      <Archive strokeWidth={1.5} className="h-4 w-4" />
                    )
                  }
                  onClick={() => {
                    closeActionsMenu();
                    showArchiveModal();
                  }}
                />
                <PopoverItem
                  variant="danger"
                  text="Delete"
                  kbd="x"
                  icon={<Trash2 strokeWidth={1.5} className="h-4 w-4" />}
                  onClick={() => {
                    closeActionsMenu();
                    showDeleteModal();
                  }}
                />
              </div>
            }
          >
            <button className="m-0 px-1 py-2 rounded-md hover:bg-skeleton/70 active:bg-skeleton/70">
              <ThreeDots className="h-5 w-5" />
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}

function PopoverItem({
  text,
  icon,
  kbd,
  variant = "normal",
  onClick,
}: {
  text: string;
  icon: ReactNode;
  kbd: string;
  onClick: () => void;
  variant?: "danger" | "normal";
}) {
  const variantColors = {
    normal: {
      button: "text-primary/80 hover:bg-skeleton/70",
      kbd: "text-primary/80 bg-skeleton/40 group-hover:bg-skeleton border-zinc-500/40",
    },
    danger: {
      button: "text-danger hover:bg-danger hover:text-white",
      kbd: cn(
        "bg-danger/10 text-danger border-danger/40",
        "group-hover:text-white group-hover:bg-content/20"
      ),
    },
  };

  return (
    <button
      className={cn(
        "group w-full flex justify-between items-center p-2 rounded-md transition-all duration-75",
        variantColors[variant].button
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 text-sm font-medium">
        {icon}
        <p>{text}</p>
      </div>
      <kbd
        className={cn(
          "hidden sm:inline-block transition-all duration-75 px-2 py-0.5 rounded-md text-xs font-light border shadow-kbd",
          variantColors[variant].kbd
        )}
      >
        {kbd}
      </kbd>
    </button>
  );
}

function CopyToClipboard({ value }: { value: string }) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  return (
    <button
      className={cn(
        "p-1.5 rounded-full transition-all duration-75",
        "hover:scale-110 active:scale-90",
        "bg-skeleton/75 text-primary/75",
        "hover:bg-skeleton hover:text-primary"
      )}
      onClick={(event) => {
        event.stopPropagation();
        toast.promise(copyToClipboard(value), {
          loading: "Copying link to clipboard...",
          success: "Copied link to clipboard!",
          error: "Failed to copy",
        });
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

function ExpirationWarning({ expiresAt }: { expiresAt: Date | string }) {
  const now = new Date();

  if (isAfter(now, new Date(expiresAt))) {
    const message =
      "Link has expired! It cannot be accessed and will redirect to the home page";
    return (
      <Tooltip content={message}>
        <div>
          <CalendarClock className="h-4 w-4 text-red-400" strokeWidth={2} />
        </div>
      </Tooltip>
    );
  }

  if (differenceInHours(new Date(expiresAt), new Date()) <= 24) {
    const message = `Link is going to expire ${dateTimeSoon(
      new Date(expiresAt),
      true
    )}`;
    return (
      <Tooltip content={message}>
        <div>
          <CalendarClock
            className="h-4 w-4 animate-wiggle text-orange-400"
            strokeWidth={2}
          />
        </div>
      </Tooltip>
    );
  }

  return null;
}

function LinkTotalClicks({
  totalClicks,
  lastClicked,
}: {
  totalClicks: number;
  lastClicked: Date | null;
}) {
  if (totalClicks === 0) return null;
  return (
    <div className="block max-w-xs px-4 py-2 text-center">
      <p className="text-sm font-semibold text-primary">
        {pluralize(totalClicks, "total click")}
      </p>
      {lastClicked && (
        <p className="mt-1 text-xs text-secondary">
          Last clicked {dateTimeAgo(lastClicked)}
        </p>
      )}
    </div>
  );
}

export default LinkCard;
