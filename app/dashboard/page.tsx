import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="w-full bg-gray-50">
      <div className="flex place-content-center mt-10">
        <Link href="/links" className="p-1">
          <div className="group rounded-md px-3 py-2 transition-all duration-75 hover:bg-gray-200 active:bg-gray-300">
            <p className="text-md text-gray-600 group-hover:text-black">
              View my links →
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
