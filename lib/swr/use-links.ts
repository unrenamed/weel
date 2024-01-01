import useSWRInfinite from "swr/infinite";
import { fetcher } from "../utils";
import { useSearchParams } from "next/navigation";
import { TLink } from "../types";

const PER_PAGE = 10;

function getKey(searchParams: URLSearchParams) {
  return (pageIndex: number, previousPageData: TLink[]) => {
    if (previousPageData && !previousPageData.length) return null;

    searchParams.set("page", (pageIndex + 1).toString());
    searchParams.set("per_page", PER_PAGE.toString());

    return `/api/links?${searchParams}`;
  };
}

export const useLinks = () => {
  const searchParams = useSearchParams();

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<TLink[]>(
      getKey(new URLSearchParams(searchParams)),
      fetcher,
      {
        revalidateOnFocus: false,
      }
    );

  const links: TLink[] = data ? ([] as TLink[]).concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PER_PAGE);
  const isRefreshing = isValidating && data && data.length === size;

  return {
    links,
    error,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    size,
    setSize,
    mutate,
  };
};
