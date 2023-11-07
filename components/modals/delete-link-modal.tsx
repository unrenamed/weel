import { ChangeEvent, useCallback, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import LoadingSpinner from "../icons/loading-spinner";

type Props = {
  link: Link;
  hideModal: () => void;
  onSubmit: () => void;
};

const deleteLink = (link: Link) => {
  return fetch(`/api/links/${link.key}`, { method: "DELETE" });
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
        Warning: Deleting this link will permanently remove all of its stats. This action
        cannot be undone.
      </p>
      <div className="flex flex-col space-y-2">
        <p className="text-sm">
          To verify, type <span className="font-medium">{domainKey}</span> below
        </p>
        <input
          id="password"
          className={`block w-full rounded-md focus:outline-none sm:text-sm`}
          onChange={verifyInput}
        />
        <button
          className="flex h-10 items-center justify-center space-x-2 rounded-md border px-4 text-sm transition-all focus:outline-none border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600 font-medium disabled:bg-red-300 disabled:cursor-not-allowed disabled:hover:text-white disabled:border-red-300"
          onClick={makeApiRequest}
          disabled={isDisabled}
        >
          {isLoading && <LoadingSpinner />}
          Confirm delete
        </button>
      </div>
    </div>
  );
}

export const useDeleteLinkModal = (link: Link, onSubmit: () => void) => {
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
