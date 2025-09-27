export class AppError extends Error {
  /**
   * Create custom wrapper error for use across the app.
   *
   * @param message - public message for use in frontend
   * @param log - internal message to log/debug etc.
   * @param cause - original error
   * @returns custom Error object
   *
   * @example
   * ```
   * TODO: Write me later.
   * ```
   */

  log?: ErrorLog;

  constructor(args: IErrorConstructorArgs) {
    super(args.message);
    this.cause = args.cause;
    this.name = this.constructor.name;
    this.log = args.log || { message: args.message };
  }
}

export class EnvError extends AppError {}

export class DbError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Internal server error.";
    super(args);
  }
}

export class ApiError extends AppError {}

export class PermissionError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Unauthorized access.";
    super(args);
  }
}

export class ValidationError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Validation failed.";
    super(args);
  }
}

export class VerificationError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Verfication failed.";
    super(args);
  }
}

export class SendMailError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Sending email failed.";
    super(args);
  }
}

export class FileSystemError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Internal server error.";
    super(args);
  }
}

export class NotFoundError extends AppError {
  constructor(args: IErrorConstructorArgs) {
    args.message = args.message || "Resource not found.";
    super(args);
  }
}

export class HttpError extends AppError {
  statusCode?: string;
  description?: string;

  constructor(
    message?: string,
    cause?: Error,
    log?: ErrorLog,
    statusCode?: string,
    description?: string,
  ) {
    super({ message, cause, log });
    this.statusCode = statusCode;
    this.description = description;
  }
}

export interface ErrorLog {
  message?: string;
  data?: object;
}

export interface IErrorConstructorArgs {
  message?: string;
  cause?: Error | unknown;
  log?: ErrorLog;
}
