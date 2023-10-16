"use client";

import { useLinks } from "@/lib/swr/use-links";
import LinkSkeleton from "./skeleton";
import LinkCard from "./card";
import LinkSort from "./sort";
import { useCallback, useRef } from "react";

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

  if (links?.length === 0) {
    return (
      <div>
        <div className="my-5 flex h-10 w-full justify-end">
          <LinkSort />
        </div>
        <ul className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <li key={i}>
              <LinkSkeleton />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (links) {
    return (
      <>
        <div className="my-5 flex h-10 w-full justify-end">
          <LinkSort />
        </div>
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
        {isLoadingMore && (
          <div className="mt-3 relative">
            <div className="w-full h-full absolute z-10 bg-gradient-to-t from-white/90" />
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
          </div>
        )}
        <div className="w-full h-10 bottom-0 sticky z-10 bg-gradient-to-t from-white/80" />
      </>
    );
  }

  return null;
}
