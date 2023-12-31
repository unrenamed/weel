import BarListCard from "./bar-list-card/card";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/components/utils";
import { deviceIconLoader } from "@/lib/image-loaders";
import { useSearchParams } from "next/navigation";

type DeviceTab = "device" | "browser" | "os";

export default function Devices() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<DeviceTab>("device");

  const { data, isLoading, isValidating } = useSWR<
    { device: string; browser: string; os: string; clicks: number }[]
  >(`/api/links/stats/${tab}?${searchParams}`, fetcher);

  return (
    <BarListCard
      title="Devices"
      data={(data ?? []).map((d) => ({
        title: d[tab],
        clicks: d.clicks,
        icon: <DeviceIcon tab={tab} name={d[tab]} />,
      }))}
      isLoading={isLoading || isValidating}
      tabs={["device", "browser", "os"]}
      selectedTab={tab}
      setTab={(tab) => setTab(tab as DeviceTab)}
      maxClicks={data?.[0]?.clicks ?? 0}
      barBackground="bg-devices-bar"
    />
  );
}

const iconsFolderMap: { [key in DeviceTab]: string } = {
  device: "types",
  browser: "browsers",
  os: "os",
};

function DeviceIcon({ tab, name }: { tab: DeviceTab; name: string }) {
  const iconsFolderPath = iconsFolderMap[tab];
  const iconURL = `${iconsFolderPath}/${encodeURIComponent(
    // encode symbols like a whitespace to fix warnings with a bad srcset prop
    name.toLowerCase()
  )}`;
  const iconDefaultURL = `${iconsFolderPath}/default`;

  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(iconURL);

  useEffect(() => {
    setSrc(iconURL);
  }, [iconURL]);

  return (
    <div className={cn({ "animate-pulse bg-skeleton": loading })}>
      <Image
        alt={name}
        src={src}
        loader={deviceIconLoader}
        onLoad={() => setLoading(false)}
        onError={() => setSrc(iconDefaultURL)}
        quality={100}
        width={16}
        height={16}
      />
    </div>
  );
}
