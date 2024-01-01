import { HttpStatusCode } from "../constants";
import { BaseError } from "./base-error";

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

export class LinkStatsLoadingError extends BaseError {
  constructor(message: string) {
    super({
      name: "Link stats cannot be loaded",
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}

export class InvalidLinkPassword extends BaseError {
  constructor(message: string) {
    super({
      name: "Invalid link password",
      statusCode: HttpStatusCode.BAD_REQUEST,
      message,
    });
  }
}
