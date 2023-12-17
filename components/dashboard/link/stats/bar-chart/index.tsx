import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";
import { max } from "@visx/vendor/d3-array";
import { Interval } from "@/lib/types";
import { motion } from "framer-motion";
import { nFormatter } from "@/lib/utils";
import { Group } from "@visx/group";
import { useMediaQuery } from "@/hooks";

type DataObject = { t: string; value: number };

type Props = {
  data: DataObject[];
  width: number;
  height: number;
  interval?: Interval;
  margin?: { top: number; right: number; bottom: number; left: number };
};

// colors
export const gray50 = "#fafafa";
export const gray300 = "#e0e0e0";
export const gray500 = "#9e9e9e";
export const gray800 = "#424242";

// accessors
const getDate = (d: DataObject) => new Date(d.t);
const getValue = (d: DataObject) => d.value;

// constants
const LEFT_AXIS_MIN_NUM_OF_TICKS = 5;

// utils
const getMaxValueForLeftAxisDomainRange = (data: DataObject[]) => {
  const maxV = max(data, getValue) ?? 0;

  // Ensure a constant number of ticks is always displayed when all data values are below a certain threshold.
  // For instance, this will display 5 ticks on the left axis, even if all data values are zero.
  if (maxV < LEFT_AXIS_MIN_NUM_OF_TICKS) {
    return LEFT_AXIS_MIN_NUM_OF_TICKS;
  }

  // Make sure the highest tick value is consistently rounded up to the next multiple of a fixed constant.
  // E.g. if the maximum value is 15, the top tick will be 15; if the maximum value is 17, the top tick will be 20.
  // This ensures that all bars are fully accommodated within the chart in terms of height.
  return (
    Math.ceil(maxV / LEFT_AXIS_MIN_NUM_OF_TICKS) * LEFT_AXIS_MIN_NUM_OF_TICKS
  );
};

// defaults
const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

export default function BarChart({
  data,
  interval,
  height,
  width,
  margin = defaultMargin,
}: Props) {
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  const formatTimestamp = useCallback(
    (e: Date) => {
      switch (interval) {
        case "1h":
          return new Date(e).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
          });
        case "24h":
          return new Date(e)
            .toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              hour: "numeric",
            })
            .replace(",", " ");
        case "90d":
        case "all":
          return new Date(e).toLocaleDateString("en-us", {
            month: "short",
            year: "numeric",
          });
        default:
          return new Date(e).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
          });
      }
    },
    [interval]
  );

  const dateScale = useMemo(
    () =>
      scaleBand<Date>({
        domain: data.map(getDate),
        padding: 0.2,
      }),
    [data]
  );
  const valueScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, getMaxValueForLeftAxisDomainRange(data)],
        nice: true,
      }),
    [data]
  );

  dateScale.rangeRound([0, xMax]);
  valueScale.range([yMax, 0]);

  if (data.length === 0) {
    return <NoData />;
  }

  if (width < 200) {
    return null;
  }

  return (
    <div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={gray50} rx={5} />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            numTicks={6}
            scale={valueScale}
            width={xMax}
            height={yMax}
            stroke={gray300}
          />
          <AxisBottom
            numTicks={6}
            top={yMax}
            scale={dateScale}
            tickFormat={formatTimestamp}
            stroke={gray500}
            tickStroke={gray500}
            tickLabelProps={{
              fill: gray800,
              fontSize: isMobile ? 9 : 12,
              textAnchor: "middle",
              angle: isMobile ? -45 : 0,
              verticalAnchor: isMobile ? "start" : "end",
            }}
          />
          <AxisLeft
            numTicks={6}
            stroke={gray500}
            tickStroke={gray500}
            scale={valueScale}
            tickFormat={(d) => nFormatter(d as number)}
            tickLabelProps={{
              fill: gray800,
              fontSize: isMobile ? 9 : 12,
            }}
          />
          {data.map(({ t, value }) => {
            const barWidth = dateScale.bandwidth();
            const barHeight = yMax - (valueScale(value) ?? 0);
            const barX = dateScale(getDate({ t, value })) ?? 0;
            const barY = yMax - barHeight;

            return (
              <motion.rect
                key={`bar-${interval}-${t}`}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="!origin-bottom fill-blue-500"
                initial={{ transform: "scaleY(0)" }}
                animate={{ transform: "scaleY(1)" }}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
}

const NoData = () => {
  return (
    <div className="px-7 pb-5 w-full h-full flex place-content-center justify-center items-center">
      <p className="flex items-center justify-center flex-wrap text-sm font-light text-gray-500">
        No data available
      </p>
    </div>
  );
};
