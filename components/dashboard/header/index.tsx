import Link from "next/link";
import HeaderLogo from "./logo";
import ThemeSwitch from "@/components/theme-switch";

export default function AppHeader() {
  return (
    <div className="sticky left-0 right-0 top-0 z-20 border-b border-gray-200 dark:border-neutral-800 bg-inherit flex place-content-center">
      <div className="w-full 2xl:w-3/5 xl:w-4/5 px-4 sm:px-3">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <HeaderLogo />
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
