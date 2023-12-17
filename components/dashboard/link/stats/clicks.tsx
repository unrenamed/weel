import { fetcher, nFormatter } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { NumberTooltip } from "@/components/shared";
import { Interval } from "@/lib/types";
import BarChart from "./bar-chart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

export default function Clicks({ total }: { total: number }) {
  const searchParams = useSearchParams();
  const interval = (searchParams.get("interval") as Interval) ?? "24h";

  const { data, isLoading } = useSWR<{ t: string; clicks: number }[]>(
    `/api/links/stats/timeseries?${searchParams}`,
    fetcher
  );

  return (
    <div className="border border-gray-200 bg-white rounded-md shadow-md p-5 sm:p-10">
      <div className="mb-5 flex items-start justify-between space-x-4">
        <div className="flex-none">
          <div className="flex items-end space-x-1">
            {total || total === 0 ? (
              <NumberTooltip value={total} unit="total click">
                <h1 className="text-3xl font-bold sm:text-4xl">
                  {nFormatter(total)}
                </h1>
              </NumberTooltip>
            ) : (
              <div className="h-10 w-12 animate-pulse rounded-md bg-gray-200" />
            )}
            <BarChart3 className="mb-1 h-6 w-6 text-gray-600" />
          </div>
          <p className="text-sm font-medium uppercase text-gray-600">
            Total Clicks
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="rounded animate-pulse bg-gray-200 w-full h-[300px] sm:h-[400px]" />
      ) : (
        <div className="h-[400px] w-full">
          <ParentSize>
            {({ width, height }) => (
              <BarChart
                width={width}
                height={height}
                interval={interval}
                data={(data ?? []).map(({ t, clicks }) => ({
                  t,
                  value: clicks,
                }))}
              />
            )}
          </ParentSize>
        </div>
      )}
    </div>
  );
}
