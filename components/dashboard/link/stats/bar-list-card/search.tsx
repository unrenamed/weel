import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { MutableRefObject } from "react";

export default function BardListCardSearch({
  search,
  inputRef,
  isVisible,
  setSearch,
  hide,
}: {
  search: string;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  isVisible: boolean;
  setSearch: (val: string) => void;
  hide: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="locations-search-input"
          className="absolute top-0 left-0 right-0 px-5 py-3 sm:px-7 sm:py-5 z-20 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ ease: "easeIn", duration: 0.25 }}
        >
          <div className="pointer-events-none absolute left-10">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="h-8 w-full rounded-md pl-10 border-gray-100 text-black bg-gray-100 placeholder:text-gray-500 focus:border-gray-500 dark:bg-neutral-700 dark:border-neutral-700 dark:text-gray-50 dark:placeholder:text-neutral-500 focus:ring-0 text-sm"
            placeholder="Search..."
            value={search}
            onBlur={() => hide()}
            onKeyDown={(ev) => ev.code === "Escape" && hide()}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
