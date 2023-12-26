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
import { cn } from "../utils";
import { useMediaQuery } from "@/hooks";
import { DrawerIsland } from "../shared";

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
          <Drawer.Overlay className="fixed inset-0 bg-overlay/20 backdrop-blur" />
          <Drawer.Content
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] max-h-[85dvh] min-h-[5dvh] bg-content border-t border-border",
              contentClassName
            )}
          >
            <DrawerIsland />
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
          className="animate-fade-in fixed inset-0 z-40 bg-overlay/50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            `animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-border bg-content p-0 shadow-xl sm:rounded-xl`,
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
