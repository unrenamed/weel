import { ReactNode, useMemo, useState } from "react";
import NoData from "./no-data";
import Skeleton from "./skeleton";
import BarList from "./bar-list";
import BarListCardHeader from "./header";

type Params = {
  title: string;
  data: {
    title: string;
    clicks: number;
    icon?: ReactNode;
  }[];
  isLoading: boolean;
  maxClicks: number;
  tabs: string[];
  selectedTab?: string;
  setTab?: (tab: string) => void;
  barBackground: string;
};

export default function BarListCard({
  title,
  data,
  isLoading,
  maxClicks,
  tabs,
  selectedTab,
  setTab,
  barBackground,
}: Params) {
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const filteredData = useMemo(() => {
    return data && data.length > 0 && search.length > 0
      ? data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
      : data;
  }, [data, search]);

  const renderData = () => {
    if (isLoading) {
      return <Skeleton />;
    }

    if (!filteredData || filteredData.length === 0) {
      return <NoData search={search} />;
    }

    return (
      <div className="px-7 pb-5">
        <BarList
          data={filteredData}
          maxClicks={maxClicks}
          onScroll={setScrolled}
          barBackground={barBackground}
        />
      </div>
    );
  };

  return (
    <div className="relative rounded-md shadow-md h-[400px] bg-white border-gray-200 flex flex-col gap-0.5">
      <BarListCardHeader
        title={title}
        tabs={tabs}
        selectedTab={selectedTab}
        setTab={setTab}
        scrolled={scrolled}
        search={search}
        setSearch={setSearch}
      />
      {renderData()}
      <div className="absolute inset-x-0 bottom-5 z-10 w-full bg-gradient-to-b from-transparent to-white">
        <div className="h-8" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 w-full bg-white rounded-b-md">
        <div className="h-4" />
      </div>
    </div>
  );
}
