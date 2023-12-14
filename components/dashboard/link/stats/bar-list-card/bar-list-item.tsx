import { Tooltip } from "@/components/shared";
import { classNames } from "@/components/utils";
import { nFormatter, pluralize } from "@/lib/utils";
import { motion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

export default function BarListItem({
  title,
  icon,
  clicks,
  maxClicks,
  barBackground,
  style,
}: {
  title: string;
  clicks: number;
  maxClicks: number;
  barBackground: string;
  icon?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className="flex justify-between items-center text-sm text-gray-800"
      style={style}
    >
      <div className="relative flex items-center w-full max-w-[calc(100%-3rem)]">
        <div className="z-10 flex space-x-2 px-2 items-center">
          {icon}
          <p className="max-w-[200px] truncate">{title}</p>
        </div>
        <motion.div
          style={{ width: `${(clicks / maxClicks) * 100}%` }}
          className={classNames(
            "absolute h-full py-4 rounded-sm origin-left",
            barBackground
          )}
          transition={{ ease: "easeOut", duration: 0.3 }}
          initial={{ transform: "scaleX(0)" }}
          animate={{ transform: "scaleX(1)" }}
        />
      </div>
      <Tooltip
        content={
          <div className="block max-w-xs px-4 py-2 text-center">
            <p className="text-sm font-semibold text-gray-700">
              {pluralize(clicks, "click")}
            </p>
          </div>
        }
      >
        <span className="pr-2">{nFormatter(clicks)}</span>
      </Tooltip>
    </div>
  );
}
