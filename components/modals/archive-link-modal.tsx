import { useCallback, useState } from "react";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import { Button, LinkAvatar, LoadingButton } from "../shared";
import { TLink } from "@/lib/types";

type Props = {
  link: TLink;
  hideModal: () => void;
  onSubmit: () => void;
};

const sendArchiveRequest = (link: TLink, archived: boolean) => {
  return fetch(`/api/links/${link.id}/archive`, {
    method: "PUT",
    body: JSON.stringify({
      archived,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function ArchiveLinkModalContent({ link, hideModal, onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const domainKey = `${link.domain}/${link.key}`;
  const archive = !link.archived;

  const handleArchiveRequest = async () => {
    setIsLoading(true);
    const response = await sendArchiveRequest(link, archive);
    setIsLoading(false);

    if (response.status !== 200) {
      toast.error(response.statusText);
    } else {
      onSubmit();
      toast.success(
        `Successfully ${archive ? "archived" : "unarchived"} link`,
        {
          action: {
            label: "Undo",
            onClick: undoAction,
          },
        }
      );
    }

    hideModal();
  };

  const undoAction = () => {
    toast.promise(sendArchiveRequest(link, !archive), {
      loading: "Undo in progress...",
      error: "Failed to roll back changes. An error occurred.",
      success: () => {
        onSubmit();
        return "Undo successful! Changes reverted.";
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-3 sm:px-12 px-4 sm:pt-8 pt-4 pb-4 text-center items-center bg-content border-b border-border">
        <LinkAvatar url={link.url} />
        <h3 className="text-lg font-medium">
          {link.archived ? "Unarchive" : "Archive"} {domainKey}
        </h3>
        <p className="text-sm text-secondary">
          {link.archived
            ? "Unarchiving this link will make it accessible and functional again."
            : "Archived links are not accessible and will redirect users to the home page."}
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:px-12 px-4 sm:py-8 py-4 bg-bkg">
        <LoadingButton
          text={`Yes, ${archive ? "archive" : "unarchive"}`}
          loading={isLoading}
          onClick={handleArchiveRequest}
          className="h-10 w-full sm:w-auto"
        />
        <Button
          text="No"
          variant="secondary"
          onClick={hideModal}
          className="h-10 w-full sm:w-auto"
        />
      </div>
    </div>
  );
}

export const useArchiveLinkModal = ({
  link,
  onSubmit,
}: {
  link: TLink;
  onSubmit: () => void;
}) => {
  const { show, hide, isOpen, Modal: ArchiveModal } = useModal();

  const Modal = useCallback(() => {
    return (
      <ArchiveModal>
        <ArchiveLinkModalContent
          link={link}
          hideModal={hide}
          onSubmit={onSubmit}
        />
      </ArchiveModal>
    );
  }, [ArchiveModal, link, hide, onSubmit]);

  return {
    show,
    hide,
    isOpen,
    Modal,
  };
};
