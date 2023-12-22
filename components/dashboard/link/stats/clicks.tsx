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

  const {
    data: timeseries,
    isLoading: loadingTimeseries,
    isValidating: validatingTimeseries,
  } = useSWR<{ t: string; clicks: number }[]>(
    `/api/links/stats/timeseries?${searchParams}`,
    fetcher
  );

  const {
    data: clicksData,
    isLoading: loadingClicks,
    isValidating: validatingClicks,
  } = useSWR<{ clicks: number }[]>(
    `/api/links/stats/clicks?${searchParams}`,
    fetcher
  );

  const totalClicks = clicksData?.[0]?.clicks ?? 0;

  return (
    <div className="bg-content rounded-md shadow-md p-5 sm:p-10">
      <div className="mb-5 flex items-start justify-between space-x-4">
        <div className="flex-none">
          <div className="flex items-end space-x-2">
            {!loadingClicks && !validatingClicks ? (
              <NumberTooltip value={totalClicks} unit="total click">
                <h1 className="text-3xl font-bold sm:text-4xl">
                  {nFormatter(totalClicks)}
                </h1>
              </NumberTooltip>
            ) : (
              <div className="h-10 w-12 animate-pulse rounded-md bg-skeleton" />
            )}
            <BarChart3 className="mb-1 h-6 w-6 text-secondary" />
          </div>
          <p className="text-sm font-medium uppercase text-secondary">
            Total Clicks
          </p>
        </div>
      </div>
      {loadingTimeseries || validatingTimeseries ? (
        <div className="rounded animate-pulse bg-skeleton w-full h-[300px] sm:h-[400px]" />
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
