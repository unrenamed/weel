import { useCallback, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import LoadingSpinner from "../icons/loading-spinner";

type Props = {
  link: Link;
  hideModal: () => void;
  onSubmit: () => void;
};

const sendApiRequest = (link: Link, archived: boolean) => {
  return fetch(`/api/links/${link.key}/archive`, {
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

  const makeApiRequest = async () => {
    setIsLoading(true);
    const response = await sendApiRequest(link, archive);
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
            onClick: () => {
              sendApiRequest(link, !archive);
            },
          },
        }
      );
    }

    hideModal();
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
        <button
          className="flex h-10 items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none bg-gray-100 text-black hover:bg-white font-medium"
          onClick={hideModal}
        >
          No
        </button>
        <button
          className="flex h-10 items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none border-black bg-black text-white hover:bg-white hover:text-black font-medium"
          onClick={makeApiRequest}
        >
          {isLoading && <LoadingSpinner />}
          Yes, {archive ? "archive" : "unarchive"}
        </button>
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
