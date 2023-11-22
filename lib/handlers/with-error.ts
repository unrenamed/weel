import { BaseError } from "@/lib/error/base-error";
import logger from "@/lib/winston";
import { NextRequest, NextResponse } from "next/server";

export function withError(fn: Function) {
  return async (request: NextRequest, ...args: any) => {
    try {
      return await fn(request, ...args);
    } catch (error) {
      // Handle all errors thrown manually
      if (error instanceof BaseError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      // Log the error to a logging system
      if (error instanceof Error) {
        logger.error(error.message, {
          requestBody: request,
          location: fn.name,
        });
      }

      // Respond with a generic 500 Internal Server Error
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
