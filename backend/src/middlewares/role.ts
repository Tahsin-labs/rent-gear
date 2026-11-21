
import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/client";
import httpStatus from "http-status";

const authorize = (...allowedRoles: Role[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Authentication required",
        errorDetails: null,
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "You do not have permission to access this resource",
        errorDetails: null,
      });
    }

    next();
  };
};

export default authorize;
