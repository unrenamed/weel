import { classNames } from "@/components/utils";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import BardListCardSearch from "./search";
import { capitalize } from "@/lib/utils";

export default function BarListCardHeader({
  title,
  scrolled,
  search,
  setSearch,
  tabs,
  selectedTab,
  setTab,
}: {
  title: string;
  scrolled: boolean;
  search: string;
  setSearch: (val: string) => void;
  tabs: string[];
  selectedTab?: string;
  setTab?: (tab: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={classNames(
        "z-10 rounded-t-md sticky top-0 px-5 py-3 sm:px-7 sm:py-5 w-full flex flex-col",
        {
          "shadow-md": scrolled,
        }
      )}
    >
      <BardListCardSearch
        inputRef={inputRef}
        search={search}
        setSearch={setSearch}
        isVisible={showInput}
        hide={() => setShowInput(false)}
      />
      <div className="w-full flex items-center justify-between">
        <div className="flex space-x-2 items-center relative">
          <h2 className="text-md font-medium sm:text-lg">{title}</h2>
          <button
            className="group rounded-full p-2 hover:bg-skeleton active:scale-95 transition-all duration-75"
            onClick={() => {
              setShowInput(true);
              inputRef.current?.focus();
            }}
          >
            <Search
              className="h-4 w-4 text-secondary/80 group-hover:text-secondary"
              strokeWidth={1.5}
            />
          </button>
        </div>
        <div className="flex justify-between items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTab?.(tab)}
              className={classNames(
                "rounded-md text-primary/70 transition duration-75 active:scale-95 text-xs sm:text-sm font-medium py-1 px-2",
                {
                  "bg-selected-bar-list-tab": selectedTab === tab,
                  "bg-bar-list-tab": selectedTab !== tab,
                }
              )}
            >
              {capitalize(tab)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
