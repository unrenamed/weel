import { ChangeEvent, useCallback, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import { LoadingButton } from "../shared";

type Props = {
  link: Link;
  hideModal: () => void;
  onSubmit: () => void;
};

const deleteLink = (link: Link) => {
  return fetch(`/api/links/${link.id}`, {
    method: "DELETE",
  });
};

function DeleteLinkModalContent({ link, hideModal, onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const domainKey = `${link.domain}/${link.key}`;

  const verifyInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setIsDisabled(event.target.value !== domainKey);
    },
    [domainKey]
  );

  const makeApiRequest = async () => {
    setIsLoading(true);
    const response = await deleteLink(link);
    setIsLoading(false);

    if (response.status !== 200) {
      toast.error(response.statusText);
    } else {
      toast.success("Successfully deleted link");
      onSubmit();
    }

    hideModal();
  };

  return (
    <div className="p-4 flex flex-col space-y-2">
      <h3 className="text-lg font-medium">Delete {domainKey}</h3>
      <p className="text-sm text-gray-500">
        Warning: Deleting this link will permanently remove all of its stats.
        This action cannot be undone.
      </p>
      <div className="flex flex-col space-y-2">
        <p className="text-sm">
          To verify, type <span className="font-bold">{domainKey}</span> below
        </p>
        <input
          id="password"
          className="block w-full rounded-md focus:outline-none text-sm"
          onChange={verifyInput}
        />
        <LoadingButton
          text="Confirm delete"
          variant="error"
          loading={isLoading}
          disabled={isDisabled}
          onClick={makeApiRequest}
          className="h-10"
        />
      </div>
    </div>
  );
}

export const useDeleteLinkModal = ({
  link,
  onSubmit,
}: {
  link: Link;
  onSubmit: () => void;
}) => {
  const { show, hide, isOpen, Modal: DeleteModal } = useModal();

  const Modal = useCallback(() => {
    return (
      <DeleteModal>
        <DeleteLinkModalContent
          link={link}
          hideModal={hide}
          onSubmit={onSubmit}
        />
      </DeleteModal>
    );
  }, [DeleteModal, link, hide, onSubmit]);

  return {
    show,
    hide,
    isOpen,
    Modal,
  };
};
