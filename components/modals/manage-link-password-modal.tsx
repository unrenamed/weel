import { useCallback } from "react";
import { useModal } from "./base-modal";
import { LinkAvatar } from "../shared";
import { ManagePasswordForm } from "../forms/manage-link-password";
import { TLink } from "@/lib/types";

type Props = {
  link: TLink;
  onSubmit: () => void;
};

function ManageLinkPasswordModalContent({ link, onSubmit }: Props) {
  const domainKey = `${link.domain}/${link.key}`;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-3 sm:px-12 px-4 sm:pt-8 pt-4 pb-4 text-center items-center bg-content border-b border-border">
        <LinkAvatar url={link.url} />
        <h3 className="text-lg font-medium">Manage password for {domainKey}</h3>
      </div>
      <div className="flex flex-col space-y-6 sm:px-12 px-4 sm:py-8 py-4 bg-bkg">
        <ManagePasswordForm
          linkId={link.id}
          hasPassword={link.hasPassword}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export const useManageLinkPasswordModal = ({ link }: { link: TLink }) => {
  const { show, hide, isOpen, Modal: ManageLinkPasswordModal } = useModal();

  const Modal = useCallback(() => {
    return (
      <ManageLinkPasswordModal>
        <ManageLinkPasswordModalContent link={link} onSubmit={hide} />
      </ManageLinkPasswordModal>
    );
  }, [ManageLinkPasswordModal, link, hide]);

  return {
    show,
    hide,
    isOpen,
    Modal,
  };
};
