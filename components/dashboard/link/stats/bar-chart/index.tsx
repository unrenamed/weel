import { GridRows } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";
import { max } from "@visx/vendor/d3-array";
import { Interval } from "@/lib/types";
import { motion } from "framer-motion";
import { nFormatter, pluralizeJSX } from "@/lib/utils";
import { Group } from "@visx/group";
import { useMediaQuery } from "@/hooks";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { NoChartData } from "./no-data";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import colors from "tailwindcss/colors";

type BarData = { date: Date; value: number };

type TooltipData = {
  value: number;
  start: Date;
  end: Date;
};

type Props = {
  data: BarData[];
  unit: string;
  width: number;
  height: number;
  interval?: Interval;
  margin?: { top: number; right: number; bottom: number; left: number };
};

// accessors
const getDate = (d: BarData) => d.date;
const getValue = (d: BarData) => d.value;

// constants
const LEFT_AXIS_MIN_NUM_OF_TICKS = 5;

// utils
const getMaxValueForLeftAxisDomainRange = (data: BarData[]) => {
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

// styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 150,
  borderRadius: "5px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
};

// variables
let tooltipTimeout: number;

export default function BarChart({
  data,
  interval,
  unit,
  height,
  width,
  margin = defaultMargin,
}: Props) {
  const isMobile = useMediaQuery("only screen and (max-width : 640px)");
  const { theme } = useTheme();

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  });

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(height - margin.top - margin.bottom, 0);

  // colors
  const rectBgColor = theme === "dark" ? colors.neutral[700] : colors.gray[50];
  const gridFillColor =
    theme === "dark" ? colors.neutral[600] : colors.gray[300];
  const axisFillColor = theme === "dark" ? colors.white : colors.gray[800];
  const axisStrokeColor = theme === "dark" ? colors.gray[50] : colors.gray[500];
  const tooltipBgColor = theme === "dark" ? colors.neutral[800] : colors.white;

  const formatDate = useCallback(
    (e: Date) => {
      switch (interval) {
        case "1h":
          return format(e, "h:mm a");
        case "24h":
          return format(e, "MMM d, h a");
        case "90d":
        case "all":
          return format(e, "MMM y");
        default:
          return format(e, "MMM d");
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
    return <NoChartData />;
  }

  if (width < 200) {
    return null;
  }

  return (
    <div>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={rectBgColor}
          rx={5}
        />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            numTicks={6}
            scale={valueScale}
            width={xMax}
            height={yMax}
            stroke={gridFillColor}
          />
          <AxisBottom
            numTicks={6}
            top={yMax}
            scale={dateScale}
            tickFormat={formatDate}
            stroke={axisStrokeColor}
            tickStroke={axisStrokeColor}
            tickLabelProps={{
              fill: axisFillColor,
              fontSize: isMobile ? 9 : 12,
              textAnchor: "middle",
              angle: isMobile ? -45 : 0,
              verticalAnchor: isMobile ? "start" : "end",
            }}
          />
          <AxisLeft
            numTicks={6}
            stroke={axisStrokeColor}
            tickStroke={axisStrokeColor}
            scale={valueScale}
            tickFormat={(d) => nFormatter(d as number)}
            tickLabelProps={{
              fill: axisFillColor,
              fontSize: isMobile ? 9 : 12,
            }}
          />
          {data.map(({ date, value }, idx) => {
            const barWidth = dateScale.bandwidth();
            const barHeight = yMax - (valueScale(value) ?? 0);
            const barX = dateScale(date) ?? 0;
            const barY = yMax - barHeight;

            return (
              <motion.rect
                key={`bar-${value}-${date.toISOString()}`}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="!origin-bottom fill-blue-500"
                initial={{ transform: "scaleY(0)" }}
                animate={{ transform: "scaleY(1)" }}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip();
                  }, 300);
                }}
                onMouseMove={(event) => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  // TooltipInPortal expects coordinates to be relative to containerRef
                  // localPoint returns coordinates relative to the nearest SVG, which
                  // is what containerRef is set to.
                  const eventSvgCoords = localPoint(event);

                  // center horizontally the tooltip by its bar
                  const left = barX + barWidth / 2 - 46;
                  // raise the tooltip above the mouse cursor
                  const top = eventSvgCoords
                    ? eventSvgCoords.y - 100
                    : undefined;

                  showTooltip({
                    tooltipData: {
                      value,
                      start: date,
                      end: data[idx + 1]?.date ?? new Date(),
                    },
                    tooltipTop: top,
                    tooltipLeft: left,
                  });
                }}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...tooltipStyles, backgroundColor: tooltipBgColor }}
        >
          <div className="text-center px-1 py-1 sm:px-2">
            {pluralizeJSX(
              (count, noun) => (
                <h3 className="text-black dark:text-white">
                  <span className="text-xl sm:text-2xl font-semibold">
                    {nFormatter(count)}
                  </span>{" "}
                  {noun}
                </h3>
              ),
              tooltipData.value,
              unit
            )}
            <p className="text-xs text-gray-600 dark:text-gray-100">
              {formatDate(tooltipData.start)} -{" "}
              {interval === "24h"
                ? format(tooltipData.end, "h a")
                : formatDate(tooltipData.end)}
            </p>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
