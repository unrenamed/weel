import { NextRequest, NextResponse } from "next/server";
import { BaseError } from "./base-error";
import logger from "../winston";

export function withErrorHandler(fn: Function) {
  return async function (request: NextRequest, ...args: any) {
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