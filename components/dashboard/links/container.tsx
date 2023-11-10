"use client";
import { useLinks } from "@/lib/swr/use-links";
import LinkSkeleton from "./skeleton";
import LinkCard from "./card";
import LinkSort from "./sort";
import { HTMLProps, useCallback, useRef } from "react";
import LinksFilters from "./filters";

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
        <ul className="space-y-3">
          {links.map((link, i) => {
            const isLastElement = links.length === i + 1;
            return isLastElement ? (
              <li key={link.id} ref={lastLinkElementRef}>
                <LinkCard link={link} revalidate={() => mutate()} />
              </li>
            ) : (
              <li key={link.id}>
                <LinkCard link={link} revalidate={() => mutate()} />
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
    <div>
      <div className="my-5 flex h-10 w-full justify-end">
        <LinkSort />
      </div>
      <div className="flex justify-between space-x-6">
        <LinksFilters />
        <div className="grow">{renderLinks()}</div>
      </div>
    </div>
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
