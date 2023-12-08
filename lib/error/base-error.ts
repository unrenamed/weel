import { HttpStatusCode } from "../constants";

export class BaseError extends Error {
  private _statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST;

  constructor({
    name,
    message,
    statusCode,
    cause,
  }: {
    name: string;
    message: string;
    statusCode: HttpStatusCode;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.cause = cause;
  }

  get statusCode() {
    return this._statusCode;
  }

  set statusCode(code) {
    this._statusCode = code;
  }
}
