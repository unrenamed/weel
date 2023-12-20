import Link from "next/link";
import Globe from "@/components/dashboard/globe";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex place-content-center">
        <Suspense>
          <Globe />
        </Suspense>
      </div>
      <div className="flex place-content-center">
        <Link href="/links" className="p-1">
          <div className="group rounded-md px-3 py-2 transition-all duration-75 hover:bg-gray-200 active:bg-gray-300">
            <p className="text-md text-gray-600 group-hover:text-black dark:text-white">
              View my links →
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
