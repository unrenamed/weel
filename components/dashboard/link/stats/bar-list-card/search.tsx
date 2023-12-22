import { SearchInput } from "@/components/shared";
import { AnimatePresence, motion } from "framer-motion";
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
          <SearchInput
            autoFocus
            ref={inputRef}
            value={search}
            className="h-8"
            onBlur={() => hide()}
            onKeyDown={(ev) => ev.code === "Escape" && hide()}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
