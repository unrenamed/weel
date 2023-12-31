import { ChangeEvent, useCallback, useState } from "react";
import { useModal } from "./base-modal";
import { toast } from "sonner";
import { LinkAvatar, LoadingButton, TextInput } from "../shared";
import { TLink } from "@/lib/types";

type Props = {
  link: TLink;
  hideModal: () => void;
  onSubmit: () => void;
};

const deleteLink = (link: TLink) => {
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
    <div className="flex flex-col">
      <div className="flex flex-col space-y-3 sm:px-12 px-4 sm:pt-8 pt-4 pb-4 text-center items-center bg-content border-b border-border">
        <LinkAvatar url={link.url} />
        <h3 className="text-lg font-medium">Delete {domainKey}</h3>
        <p className="text-sm text-secondary">
          Warning: Deleting this link will permanently remove all of its stats.
          This action cannot be undone.
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:px-12 px-4 sm:py-8 py-4 bg-bkg">
        <div className="flex flex-col space-y-2">
          <p className="text-sm">
            To verify, type <span className="font-bold">{domainKey}</span> below
          </p>
          <TextInput onChange={verifyInput} />
        </div>
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
  link: TLink;
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
