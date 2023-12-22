import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SearchInput, Switch } from "@/components/shared";

export default function LinksFilters() {
  return (
    <div className="drop-shadow-lg rounded-md border-border border-1 flex bg-content px-5 self-start">
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
      <SearchInput
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
      <label className="text-sm leading-none font-medium">
        Include archived
      </label>
      <Switch
        onCheckedChange={setQueryParams}
        defaultChecked={searchParams.get("show_archived") === "true"}
      />
    </div>
  );
};
