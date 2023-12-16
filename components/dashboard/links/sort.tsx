import { ButtonDropdown } from "@/components/shared";
import { ArrowDown10 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const sortOptions = [
  {
    key: "createdAt", // used by default
    display: "Date Created",
  },
  {
    key: "totalClicks",
    display: "Number of clicks",
  },
  {
    key: "lastClicked",
    display: "Last Clicked",
  },
];

export default function LinkSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSort = useMemo(() => {
    return (
      sortOptions.find((s) => s.key === searchParams.get("sort")) ??
      sortOptions[0]
    );
  }, [searchParams]);

  const changeSort = (key: string) => {
    const params = new URLSearchParams(searchParams);
    if (key !== "createdAt") {
      params.set("sort", key);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <ButtonDropdown
      text="Sort by"
      icon={<ArrowDown10 className="h-4 w-4" strokeWidth={1.5} />}
      items={sortOptions.map(({ key: value, display }) => ({ value, display }))}
      onSelect={changeSort}
      selected={selectedSort.key}
    />
  );
}
