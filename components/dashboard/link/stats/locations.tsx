import BarListCard from "./bar-list-card/card";
import { useState } from "react";
import { classNames } from "@/components/utils";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { COUNTRIES } from "@/lib/constants/countries";
import { flagIconLoader } from "@/lib/image-loaders";
import { useSearchParams } from "next/navigation";

type LocationTab = "country" | "city";

export default function Locations() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<LocationTab>("country");

  const { data, isLoading, isValidating } = useSWR<
    { country: string; city: string; clicks: number }[]
  >(`/api/links/stats/${tab}?${searchParams}`, fetcher);

  return (
    <BarListCard
      title="Locations"
      data={(data ?? []).map((d) => ({
        key: tab === "country" ? d.country : `${d.country}/${d.city}`,
        title: tab === "country" ? COUNTRIES[d.country] : d.city,
        clicks: d.clicks,
        icon: <CountryFlag code={d.country} />,
      }))}
      isLoading={isLoading || isValidating}
      tabs={["country", "city"]}
      selectedTab={tab}
      setTab={(tab) => setTab(tab as LocationTab)}
      maxClicks={data?.[0]?.clicks ?? 0}
      barBackground="bg-orange-100"
    />
  );
}

function CountryFlag({ code }: { code: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className={classNames({ "animate-pulse bg-gray-200": loading })}>
      <Image
        alt={code}
        src={code}
        loader={flagIconLoader}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        quality={100}
        width={20}
        height={15}
      />
    </div>
  );
}
