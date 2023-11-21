import { useCallback, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import { LoadingButton } from "../shared/loading-button";
import { Button } from "../shared/button";

type Props = {
  link: Link;
  hideModal: () => void;
  onSubmit: () => void;
};

const sendArchiveRequest = (link: Link, archived: boolean) => {
  return fetch(`/api/links/${link.key}/archive?domain=${link.domain}`, {
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
    <div className="p-4 flex flex-col space-y-2">
      <h3 className="text-lg font-medium">
        {link.archived ? "Unarchive" : "Archive"} {domainKey}
      </h3>
      <p className="text-sm text-gray-500">
        {link.archived
          ? "By unarchiving this link, it will show up on your main dashboard again."
          : "Archived links will still work - they just won't show up on your main dashboard."}
      </p>
      <div className="flex justify-end space-x-4">
        <Button
          text="No"
          variant="secondary"
          onClick={hideModal}
          className="h-10"
        />
        <LoadingButton
          text={`Yes, ${archive ? "archive" : "unarchive"}`}
          loading={isLoading}
          onClick={handleArchiveRequest}
          className="h-10"
        />
      </div>
    </div>
  );
}

export const useArchiveLinkModal = ({
  link,
  onSubmit,
}: {
  link: Link;
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
