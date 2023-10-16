import Chart from "@/components/icons/chart";
import { formatDate, capitalize } from "@/lib/utils";
import { Link } from "@prisma/client";

export default function LinkCard({ link }: { link: Link }) {
  const domainKey = `${link.domain}/${link.key}`;
  const href = `https://${domainKey}`;

  return (
    <div className="flex justify-between items-center rounded-lg border-2 border-gray-50 bg-white p-3 shadow transition-all hover:shadow-md sm:p-4">
      <div>
        <div className="flex items-center">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-blue-800 font-semibold"
          >
            {domainKey}
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {capitalize(formatDate(link.createdAt))}
          </p>
          <p className="hidden xs:block">•</p>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="truncate md:max-w-[450px] sm:max-w-[300px] max-w-[150px] hover:underline font-medium text-gray-700 text-sm"
          >
            {link.url}
          </a>
        </div>
      </div>
      <div className="flex items-center flex-col justify-center space-x-1 space-y-1">
        <a
          onClick={(e) => e.stopPropagation()}
          href={`/links/${encodeURIComponent(link.key)}`}
          className="flex items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100"
        >
          <Chart className="h-4 w-4" />
          <p className="whitespace-nowrap text-sm text-gray-500">
            {link.totalClicks}
            <span className="ml-1 hidden sm:inline-block">clicks</span>
          </p>
        </a>
      </div>
    </div>
  );
}
