import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";

const customFormat = format.printf(
  ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

const fileLogTransport = new transports.DailyRotateFile({
  filename: `logs/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

const consoleTransport = new transports.Console({
  level: process.env.LOG_LEVEL,
  handleExceptions: false,
  format: format.combine(format.colorize(), customFormat),
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    customFormat
  ),
  defaultMeta: { service: "weel" },
  transports: [consoleTransport],
});

if (process.env.NODE_ENV === "development") {
  logger.add(fileLogTransport);
}

export default logger;
