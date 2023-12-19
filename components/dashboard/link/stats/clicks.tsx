import { fetcher, nFormatter } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { NumberTooltip } from "@/components/shared";
import { Interval } from "@/lib/types";
import BarChart from "./bar-chart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

export default function Clicks() {
  const searchParams = useSearchParams();
  const interval = (searchParams.get("interval") as Interval) ?? "24h";

  const { data: timeseries, isLoading: loadingTimeseries } = useSWR<
    { t: string; clicks: number }[]
  >(`/api/links/stats/timeseries?${searchParams}`, fetcher);

  const { data: clicksData, isLoading: loadingClicks } = useSWR<
    { clicks: number }[]
  >(`/api/links/stats/clicks?${searchParams}`, fetcher);

  const totalClicks = clicksData?.[0]?.clicks ?? 0;

  return (
    <div className="border border-gray-200 bg-white rounded-md shadow-md p-5 sm:p-10">
      <div className="mb-5 flex items-start justify-between space-x-4">
        <div className="flex-none">
          <div className="flex items-end space-x-1">
            {!loadingClicks && totalClicks ? (
              <NumberTooltip value={totalClicks} unit="total click">
                <h1 className="text-3xl font-bold sm:text-4xl">
                  {nFormatter(totalClicks)}
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
      {loadingTimeseries ? (
        <div className="rounded animate-pulse bg-gray-200 w-full h-[300px] sm:h-[400px]" />
      ) : (
        <div className="h-[400px] w-full">
          <ParentSize>
            {({ width, height }) => (
              <BarChart
                unit="click"
                width={width}
                height={height}
                interval={interval}
                data={(timeseries ?? []).map(({ t, clicks }) => ({
                  date: new Date(t),
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
