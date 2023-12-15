import Link from "next/link";
import HeaderLogo from "./logo";

export default function AppHeader() {
  return (
    <div className="sticky left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white flex place-content-center">
      <div className="w-full 2xl:w-3/5 xl:w-4/5 px-3">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <HeaderLogo />
          </Link>
        </div>
      </div>
    </div>
  );
}
