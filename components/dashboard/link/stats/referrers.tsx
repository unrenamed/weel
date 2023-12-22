import BarListCard from "./bar-list-card/card";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { classNames } from "@/components/utils";
import Image from "next/image";
import { Globe } from "lucide-react";
import { faviconLoader } from "@/lib/image-loaders";
import { useSearchParams } from "next/navigation";

export default function Referrers() {
  const searchParams = useSearchParams();
  
  const { data, isLoading, isValidating } = useSWR<
    { referrer: string; clicks: number }[]
  >(`/api/links/stats/referrer?${searchParams}`, fetcher);

  return (
    <BarListCard
      title="Referrers"
      data={(data ?? []).map((d) => ({
        title: d.referrer,
        clicks: d.clicks,
        icon: <ReferrerIcon referrer={d.referrer} />,
      }))}
      isLoading={isLoading || isValidating}
      tabs={[]}
      maxClicks={data?.[0]?.clicks ?? 0}
      barBackground="bg-referrers-bar"
    />
  );
}

function ReferrerIcon({ referrer }: { referrer: string }) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [referrer]);

  return (
    <div className={classNames({ "animate-pulse bg-skeleton": loading })}>
      {isError ? (
        <Globe className="h-4 w-4 text-secondary" />
      ) : (
        <Image
          alt={referrer}
          src={faviconLoader({ src: referrer, width: 16 })}
          onLoad={() => setLoading(false)}
          onError={() => {
            setIsError(true);
            setLoading(false);
          }}
          quality={100}
          width={16}
          height={16}
        />
      )}
    </div>
  );
}
