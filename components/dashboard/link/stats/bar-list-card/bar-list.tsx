import { CSSProperties, ReactNode } from "react";
import BarListItem from "./bar-list-item";
import VirtualizedList from "react-virtualized/dist/es/List";
import AutoSizer from "react-virtualized/dist/es/AutoSizer";
import { round } from "@/lib/utils";
import { useMediaQuery } from "@/hooks";
import { classNames } from "@/components/utils";

export default function BarList({
  data,
  maxClicks,
  onScroll,
  barBackground,
}: {
  data: {
    title: string;
    clicks: number;
    icon?: ReactNode;
  }[];
  maxClicks: number;
  onScroll: (scrolled: boolean) => void;
  barBackground: string;
}) {
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  const rowRenderer = ({
    key,
    index,
    style,
  }: {
    key: string;
    index: number;
    style: CSSProperties;
  }) => {
    const { title, icon, clicks } = data[index];
    return (
      <BarListItem
        key={key}
        title={title}
        icon={icon}
        clicks={clicks}
        maxClicks={maxClicks}
        barBackground={barBackground}
        style={style} // required to fix flickering issue https://github.com/bvaughn/react-virtualized/issues/880#issuecomment-345704492
      />
    );
  };

  return (
    <AutoSizer>
      {({ width }) => (
        <VirtualizedList
          className={classNames(
            "overflow-auto",
            "scrollbar scrollbar-w-1.5 scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl",
            "scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-500",
            "dark:scrollbar-track-neutral-600 dark:scrollbar-thumb-neutral-700 hover:dark:scrollbar-thumb-neutral-400"
          )}
          onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
            onScroll(round(scrollTop / (scrollHeight - clientHeight), 4) > 0);
          }}
          width={width}
          height={isMobile ? 316 : 300}
          rowCount={data.length}
          rowHeight={36}
          rowRenderer={rowRenderer}
          overscanRowCount={3}
        />
      )}
    </AutoSizer>
  );
}
