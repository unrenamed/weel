import {
    format,
    differenceInMilliseconds,
    formatDistanceToNow,
    isThisYear,
} from "date-fns";

export const dateTimeAgo = (timestamp: Date) => {
  const date = new Date(timestamp);
  const diff = differenceInMilliseconds(Date.now(), date);

  if (diff < 2 * 1000) {
    return "just now";
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${formatDistanceToNow(date)} ago`;
  } else {
    return format(date, `MMM d ${isThisYear(date) ? "" : "y"}`);
  }
};

export const dateTimeSoon = (timestamp: Date, addSuffix = false) => {
  const date = new Date(timestamp);
  const diff = differenceInMilliseconds(date, Date.now());

  if (diff < 1 * 1000) {
    return formatDistanceToNow(date, { addSuffix, includeSeconds: true });
  } else if (diff < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix });
  } else {
    const suffix = addSuffix ? "on " : "";
    return suffix + format(date, `ccc, MMM do ${isThisYear(date) ? "" : "y"}`);
  }
};

export const getDateTimeLocal = (d: Date | string): string => {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const timePart = date.toLocaleTimeString().split(":").slice(0, 2).join(":");
  const datePart = date.toISOString().split("T")[0];
  return `${datePart}T${timePart}`;
};
