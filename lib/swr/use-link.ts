import useSWR from "swr";
import { fetcher } from "../utils";
import { Link } from "@prisma/client";
import { useParams } from "next/navigation";

export const useLink = () => {
  const { key } = useParams() as {key: string };

  const { data, error, isLoading, isValidating } = useSWR<Link>(
    key && `/api/links/${encodeURIComponent(key)}`,
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
