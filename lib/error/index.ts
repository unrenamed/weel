import { NextRequest, NextResponse } from "next/server";
import HttpStatusCode from "../constants/http-status-code";
import { BaseError } from "./base-error";

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
      console.error({ error, requestBody: request, location: fn.name });

      // Respond with a generic 500 Internal Server Error
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

export class DuplicateKeyError extends BaseError {
  constructor(message: string) {
    super({
      name: "Duplicate key",
      statusCode: HttpStatusCode.CONFLICT,
      message,
    });
  }
}

export class InvalidExpirationTimeError extends BaseError {
  constructor(message: string) {
    super({
      name: "Invalid expiration time",
      statusCode: HttpStatusCode.BAD_REQUEST,
      message,
    });
  }
}

export class LinkNotFoundError extends BaseError {
  constructor(message: string) {
    super({
      name: "Link not found",
      statusCode: HttpStatusCode.NOT_FOUND,
      message,
    });
  }
}
