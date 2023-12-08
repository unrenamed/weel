import { ArrowRight, ChevronRight } from "lucide-react";
import IntervalDropdown from "./interval-dropdown";

export default function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center">
      <a
        className="flex group items-center text-lg font-semibold text-gray-800 md:text-xl"
        href={`https://${title}`}
        target="_blank"
        rel="noreferrer"
      >
        {title}
        <div className="relative group flex items-center">
          <ChevronRight
            strokeWidth={2.5}
            className="absolute h-5 w-5 group-hover:translate-x-1 group-hover:opacity-0 transition-all"
          />
          <ArrowRight
            strokeWidth={2.5}
            className="absolute h-5 w-5 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all"
          />
        </div>
      </a>
      <IntervalDropdown />
    </div>
  );
}
