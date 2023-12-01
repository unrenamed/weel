import { Link } from "@prisma/client";
import BarListCard from "./bar-list-card/card";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Image from "next/image";
import { classNames } from "@/components/utils";
import { deviceIconLoader } from "@/lib/image-loaders";

type DeviceTab = "device" | "browser" | "os";

export default function Devices({ link }: { link: Link }) {
  const [tab, setTab] = useState<DeviceTab>("device");

  const { data, isLoading, isValidating } = useSWR<
    { device: string; browser: string; os: string; clicks: number }[]
  >(`/api/links/stats/${tab}?domain=${link.domain}&key=${link.key}`, fetcher);

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
      barBackground="bg-blue-100"
    />
  );
}

const iconsFolderMap: { [key in DeviceTab]: string } = {
  device: "types",
  browser: "browsers",
  os: "os",
};

function DeviceIcon({ tab, name }: { tab: DeviceTab; name: string }) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const iconsFolderPath = iconsFolderMap[tab];
  const iconURL = `${iconsFolderPath}/${name.toLowerCase()}`;
  const iconDefaultURL = `${iconsFolderPath}/default`;

  const src = isError ? iconDefaultURL : iconURL;

  return (
    <div className={classNames({ "animate-pulse bg-gray-200": loading })}>
      <Image
        alt={name}
        src={src}
        loader={deviceIconLoader}
        onLoad={() => setLoading(false)}
        onError={() => setIsError(true)}
        quality={100}
        width={16}
        height={16}
      />
    </div>
  );
}
