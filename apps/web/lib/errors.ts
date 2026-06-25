export class AppError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function toUserMessage(error: unknown) {
  if (isNextRedirectError(error)) return "Authentication is required.";
  if (error instanceof AppError) return error.message;
  if (typeof error === "object" && error !== null && "name" in error && error.name === "ZodError") {
    return "Invalid request.";
  }
  if (process.env.NODE_ENV === "production") return "Something went wrong.";
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}

export function toErrorStatus(error: unknown) {
  if (isNextRedirectError(error)) return 401;
  if (error instanceof AppError) return error.status;
  if (typeof error === "object" && error !== null && "name" in error && error.name === "ZodError") {
    return 422;
  }
  return 500;
}

export function toErrorCode(error: unknown) {
  if (isNextRedirectError(error)) return "AUTH_REQUIRED";
  if (error instanceof AppError) return error.code;
  if (typeof error === "object" && error !== null && "name" in error && error.name === "ZodError") {
    return "VALIDATION_ERROR";
  }
  return "INTERNAL_ERROR";
}

function isNextRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

export function toApiError(error: unknown) {
  return {
    error: {
      code: toErrorCode(error),
      message: toUserMessage(error)
    }
  };
}
