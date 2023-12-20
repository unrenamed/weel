"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
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
import { useMediaQuery } from "@/hooks";

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
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  const closeModal = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  if (isMobile) {
    return (
      <Drawer.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-gray-100/10 backdrop-blur" />
          <Drawer.Content
            className={classNames(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] max-h-[85dvh] min-h-[5dvh] bg-white dark:bg-neutral-900 border-t border-zinc-200 dark:border-neutral-700",
              contentClassName
            )}
          >
            <div className="sticky my-3 top-0 z-20 rounded-t-[10px] bg-inherit">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300 flex-shrink-0" />
            </div>
            {children}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

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
            `animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-600 p-0 shadow-xl sm:rounded-xl`,
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
