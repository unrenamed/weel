import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, ReactNode, SetStateAction, memo, useState } from "react";

type Props = {
  isOpen: boolean;
  children: ReactNode;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

const BaseModal = memo(function BaseModal({
  children,
  isOpen,
  setIsOpen,
}: Props) {
  const closeModal = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white p-0 shadow-xl md:rounded-xl"
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const show = () => setIsOpen(true);
  const hide = () => setIsOpen(false);

  const Modal = ({ children }: { children: ReactNode }) => (
    <>
      {isOpen && (
        <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
          {children}
        </BaseModal>
      )}
    </>
  );

  return { show, hide, isOpen, Modal };
};
