"use client";
import { useLinks } from "@/lib/swr/use-links";
import LinkSkeleton from "./skeleton";
import LinkCard from "./card";
import LinkSort from "./sort";
import { HTMLProps, useCallback, useEffect, useRef } from "react";
import LinksFilters from "./filters";
import { useCreateEditLinkModal } from "@/components/modals/create-edit-link-modal";
import { KeyboardActionButton } from "@/components/shared/keyboard-action-button";

export default function LinksContainer() {
  const {
    links,
    isReachingEnd,
    isLoadingMore,
    setSize,
    size,
    mutate,
    isRefreshing,
  } = useLinks();

  const mutateLinks = useCallback(() => {
    mutate();
  }, [mutate]);

  const { show, Modal: CreateEditLinkModal } = useCreateEditLinkModal({
    onSubmit: mutateLinks,
  });

  const observer = useRef<IntersectionObserver>();
  const lastLinkElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isReachingEnd) {
            setSize(size + 1);
          }
        },
        { threshold: 0.3 }
      );
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, isReachingEnd, size, setSize]
  );

  const renderLinks = () => {
    if (links?.length === 0) {
      return isLoadingMore ? <CardsLoadingSkeleton /> : <NoLinksFound />;
    }

    if (isRefreshing) {
      return <CardsLoadingSkeleton />;
    }

    return (
      <>
        <ul className="grid auto-rows-min gap-3">
          {links.map((link, i) => {
            const isLastElement = links.length === i + 1;
            return isLastElement ? (
              <li key={link.id} ref={lastLinkElementRef}>
                <LinkCard
                  link={link}
                  onArchive={mutateLinks}
                  onDelete={mutateLinks}
                  onEdit={mutateLinks}
                  onDuplicate={mutateLinks}
                />
              </li>
            ) : (
              <li key={link.id}>
                <LinkCard
                  link={link}
                  onArchive={mutateLinks}
                  onDelete={mutateLinks}
                  onEdit={mutateLinks}
                  onDuplicate={mutateLinks}
                />
              </li>
            );
          })}
        </ul>
        {isLoadingMore && (
          <div className="mt-3">
            <CardsLoadingSkeleton animated />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="grid gap-5">
      <CreateEditLinkModal />
      <div className="flex justify-between flex-wrap space-y-3 xs:w-full xs:space-y-0">
        <CreateLinkButton onClick={show} />
        <LinkSort />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-2">
          <LinksFilters />
        </div>
        <div className="col-span-1 lg:col-span-5">{renderLinks()}</div>
      </div>
    </div>
  );
}

function CreateLinkButton({ onClick }: { onClick: () => void }) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const existingModalBackdrop = document.getElementById("modal-backdrop");
      if (
        e.key === "c" && // "c" key is pressed
        !e.metaKey && // user is not pressing "cmd + c"
        !e.ctrlKey && // user is not pressing "ctrl + c"
        target.tagName !== "INPUT" && // user is not typing in an input
        target.tagName !== "TEXTAREA" && // user is not typing in a textarea
        !existingModalBackdrop // no other modal is open
      ) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <KeyboardActionButton
      text="Create link"
      kbd="C"
      onClick={onClick}
      className="h-10 w-full xs:w-40"
    />
  );
}

function NoLinksFound() {
  return <div>No links found</div>;
}

function CardsLoadingSkeleton({
  cardsNum = 5,
  animated,
}: {
  cardsNum?: number;
  animated?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {[...Array(cardsNum)].map((_, i) => {
        const props: HTMLProps<HTMLLIElement> = {};
        if (animated) {
          props.className = "animate-move-up";
          props.style = {
            animationDelay: `${i * 50}ms`,
            animationFillMode: "backwards",
          };
        }
        return (
          <li key={i} {...props}>
            <LinkSkeleton />
          </li>
        );
      })}
    </ul>
  );
}
