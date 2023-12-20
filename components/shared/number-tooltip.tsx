import { ReactNode } from "react";
import { Tooltip } from ".";
import { pluralize } from "@/lib/utils";

export default function NumberTooltip({
  value,
  unit,
  children,
  content = null,
}: {
  value: number | null;
  unit: string;
  children: ReactNode;
  content?: ReactNode;
}) {
  if (!value || value < 1000) {
    return children;
  }

  return (
    <Tooltip
      content={
        <div className="block max-w-xs px-4 py-2 text-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
            {pluralize(value, unit)}
          </p>
          {content}
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}
