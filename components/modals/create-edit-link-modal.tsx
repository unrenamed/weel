import { UIEvent, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@prisma/client";
import { useModal } from "./base-modal";
import { CreateEditLinkForm } from "../forms/create-edit-link";
import { FormData } from "../forms/create-edit-link/schema";
import { toast } from "sonner";
import { CreateLink } from "@/lib/types";
import { LoadingButton } from "../shared/loading-button";
import { classNames } from "../utils";

type Props = {
  link?: Link;
  mode?: "create" | "edit";
  hideModal: () => void;
  onSubmit: () => void;
};

function CreateEditLinkModalContent({
  link,
  hideModal,
  onSubmit,
  mode = "create",
}: Props) {
  const isEditMode = mode === "edit";
  const containerRef = useRef<HTMLDivElement>(null);

  const [isSubmitAtBottom, setIsSubmitAtBottom] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const updateSubmitButtonPosition = (elem: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = elem;
    setIsSubmitAtBottom(Math.abs(scrollHeight - scrollTop - clientHeight) < 5);
  };

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const handleContainerScroll = useCallback(() => {
    if (!containerRef.current) return;
    updateSubmitButtonPosition(containerRef.current);
  }, []);

  const sendAPIRequest = async (rawData: FormData) => {
    setIsLoading(true);

    const payload: CreateLink = {
      ...rawData,
      expiresAt: rawData?.expiresAt
        ? new Date(rawData.expiresAt).toISOString()
        : undefined,
      geo:
        rawData?.geo && rawData.geo.length > 0
          ? Object.fromEntries(
              rawData.geo.map(({ country, url }) => [country, url])
            )
          : undefined,
    };

    const apiUrl = isEditMode ? `/api/links/${link?.key}` : "/api/links";
    const method = isEditMode ? "PATCH" : "POST";

    const response = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if ([200, 201].includes(response.status)) {
      const domainKey = `${payload.domain}/${payload.key}`;
      // Copy new link to clipboard
      toast.promise(navigator.clipboard.writeText(domainKey), {
        loading: "Copying link to clipboard...",
        success: "Copied link to clipboard!",
        error: "Failed to copy",
      });
      // Close the modal
      hideModal();
      // Call the callback
      onSubmit();
    } else {
      const { error } = (await response.json()) as { error: string };
      toast.error(error.length ? error : response.statusText);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleContainerScroll();
  }, [containerRef.current?.scrollHeight, handleContainerScroll]);

  return (
    <div
      ref={containerRef}
      onScroll={(event: UIEvent<HTMLDivElement>) =>
        updateSubmitButtonPosition(event.currentTarget)
      }
      className="scrollbar-hide max-h-[90vh] overflow-auto"
    >
      <div className="flex flex-col">
        <div className="z-10 flex justify-center border-bborder-gray-200 bg-white py-4 px-4 md:px-16 md:py-6 transition-all md:sticky md:top-0">
          <h3 className="text-lg font-medium">
            {isEditMode ? "Edit Link" : "Create Link"}
          </h3>
        </div>
        <CreateEditLinkForm
          link={link}
          mode={mode}
          onSectionOpen={handleContainerScroll}
          onFormHeightIncrease={scrollToBottom}
          onSave={sendAPIRequest}
          submitButton={({ isSubmitting }) => {
            const loading = isLoading || isSubmitting;
            return (
              <div
                className={classNames(
                  "z-10 px-4 py-8 transition-all md:sticky md:bottom-0 md:px-16 m-0",
                  {
                    "bg-gray-50 md:shadow-[0_-20px_30px_-10px_rgba(0,0,0,0.1)]":
                      !isSubmitAtBottom,
                  }
                )}
              >
                <LoadingButton
                  text={isEditMode ? "Edit Link" : "Create Link"}
                  loading={loading}
                  disabled={loading}
                  className="w-full py-2 px-8"
                />
              </div>
            );
          }}
        ></CreateEditLinkForm>
      </div>
    </div>
  );
}

export const useCreateEditLinkModal = ({
  link,
  onSubmit,
  mode,
}: {
  link?: Link;
  mode?: "create" | "edit";
  onSubmit: () => void;
}) => {
  const { show, hide, isOpen, Modal: CreateEditModal } = useModal();

  const Modal = useCallback(() => {
    return (
      <CreateEditModal contentClassName="max-w-xl">
        <CreateEditLinkModalContent
          link={link}
          mode={mode}
          hideModal={hide}
          onSubmit={onSubmit}
        />
      </CreateEditModal>
    );
  }, [CreateEditModal, link, mode, hide, onSubmit]);

  return {
    show,
    hide,
    isOpen,
    Modal,
  };
};
