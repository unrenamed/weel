"use client";

import { useLinks } from "@/lib/swr/use-links";
import LinkSkeleton from "./skeleton";
import LinkCard from "./card";
import LinkSort from "./sort";
import { useCallback, useRef } from "react";
import LinksFilters from "./filters";

export default function LinksContainer() {
  const { links, isReachingEnd, isLoadingMore, setSize, size } = useLinks();

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

  const renderCardsPlaceholder = () => (
    <ul className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <li key={i}>
          <LinkSkeleton />
        </li>
      ))}
    </ul>
  );

  const renderCardsAnimatedPlaceholder = () => (
    <ul className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <li
          key={i}
          className="animate-move-up"
          style={{
            animationDelay: `${i * 50}ms`,
            animationFillMode: "backwards",
          }}
        >
          <LinkSkeleton />
        </li>
      ))}
    </ul>
  );

  const renderLinksList = () => (
    <ul className="space-y-3">
      {links.map((link, i) => {
        const isLastElement = links.length === i + 1;
        return isLastElement ? (
          <li key={link.id} ref={lastLinkElementRef}>
            <LinkCard link={link} />
          </li>
        ) : (
          <li key={link.id}>
            <LinkCard link={link} />
          </li>
        );
      })}
    </ul>
  );

  const renderNoLinksFound = () => <div>No links found</div>;

  const renderItems = () => {
    if (links?.length === 0) {
      return isLoadingMore ? renderCardsPlaceholder() : renderNoLinksFound();
    }

    return (
      <>
        {links?.length > 0 && renderLinksList()}
        {links?.length > 0 && isLoadingMore && (
          <div className="mt-3">{renderCardsAnimatedPlaceholder()}</div>
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
        <div className="grow">{renderItems()}</div>
      </div>
    </div>
  );
}
