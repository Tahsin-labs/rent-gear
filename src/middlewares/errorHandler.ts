
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  let statusCode = 500;
  let message = "Internal server error";
  let errorDetails: unknown = null;

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = error.issues;
  }

  // Prisma errors
  else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    const prismaError = error as {
      code: string;
      meta?: unknown;
    };

    switch (prismaError.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate record already exists";
        errorDetails = prismaError.meta ?? null;
        break;

      case "P2025":
        statusCode = 404;
        message = "Requested record not found";
        break;

      case "P2003":
        statusCode = 400;
        message = "Related record does not exist";
        errorDetails = prismaError.meta ?? null;
        break;
    }
  }

  // JWT errors
  else if (
    error instanceof Error &&
    error.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  else if (
    error instanceof Error &&
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  // Custom status code errors
  else if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    statusCode = error.statusCode;
    message = error instanceof Error
      ? error.message
      : "Request failed";
  }

  else if (error instanceof Error) {
    message = error.message;
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};

export default errorHandler;
