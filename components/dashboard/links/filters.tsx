import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Switch } from "@/components/shared";
import { Search } from "lucide-react";

export default function LinksFilters() {
  return (
    <div className="drop-shadow-lg rounded-md border-gray-200 border-1 flex bg-white px-5 self-start">
      <div className="w-full flex flex-col gap-3 py-3 sm:py-5">
        <h3 className="font-semibold ml-1">Filters</h3>
        <SearchField />
        <IncludeArchivedSwitch />
      </div>
    </div>
  );
}

const SearchField = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debounced = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.length) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  useEffect(() => {
    return () => debounced.cancel();
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-500" />
      </div>
      <input
        type="text"
        className="w-full rounded-md pl-10 border-gray-200 text-black bg-gray-200 placeholder:text-gray-500 text-sm focus:border-black focus:ring-0"
        placeholder="Search the links..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(ev) => debounced(ev.target.value)}
      />
    </div>
  );
};

const IncludeArchivedSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQueryParams = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("show_archived", "true");
    } else {
      params.delete("show_archived");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <label className="text-sm text-gray-800 leading-none font-medium">
        Include archived
      </label>
      <Switch
        onCheckedChange={setQueryParams}
        defaultChecked={searchParams.get("show_archived") === "true"}
      />
    </div>
  );
};
