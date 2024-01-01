import useSWR from "swr";
import { fetcher } from "../utils";
import { useSearchParams } from "next/navigation";
import { TLink } from "../types";

export const useLink = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const domain = searchParams.get("domain");

  const { data, error, isLoading, isValidating } = useSWR<TLink>(
    key && `/api/links/info?domain=${domain}&key=${key}`,
    fetcher,
    {
      dedupingInterval: 5000,
    }
  );

  return {
    link: data,
    error,
    isLoading,
    isValidating,
  };
};
