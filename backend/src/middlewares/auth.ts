
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../config";
import { JwtPayload } from "../modules/auth/auth.interface";
import { prisma } from "../lib/prisma";


const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    // Support Bearer token and HTTP-only cookie
    const token =
      authorization?.startsWith("Bearer ")
        ? authorization.split(" ")[1]
        : req.cookies?.accessToken;

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "You are not authorized",
        errorDetails: null,
      });
    }

    if (!config.jwt_access_secret) {
      throw new Error("JWT secret is not configured");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret
    ) as JwtPayload;

    // Verify that user still exists and is active
    const user = await import("../lib/prisma").then(
      ({ prisma }) =>
        prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            role: true,
            activeStatus: true,
          },
        })
    );

    if (!user || user.activeStatus === "BLOCKED") {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Your account is unavailable",
        errorDetails: null,
      });
    }

    res.locals.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Invalid or expired token",
      errorDetails: null,
    });
  }
};

export default auth;
