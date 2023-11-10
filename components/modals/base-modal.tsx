import * as Dialog from "@radix-ui/react-dialog";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { classNames } from "../utils";

type Props = {
  isOpen: boolean;
  children: ReactNode;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  contentClassName?: string;
};

const BaseModal = memo(function BaseModal({
  children,
  isOpen,
  setIsOpen,
  contentClassName,
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
          className={classNames(
            `animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white p-0 shadow-xl md:rounded-xl`,
            contentClassName
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);

  const Modal = useCallback(
    ({
      children,
      contentClassName,
    }: {
      children: ReactNode;
      contentClassName?: string;
    }) => (
      <>
        {isOpen && (
          <BaseModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            contentClassName={contentClassName}
          >
            {children}
          </BaseModal>
        )}
      </>
    ),
    [isOpen]
  );

  return useMemo(
    () => ({ show, hide, isOpen, Modal }),
    [show, hide, isOpen, Modal]
  );
};
