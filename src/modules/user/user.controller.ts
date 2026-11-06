
import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Name, email, password and role are required",
        errorDetails: null,
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Name must contain at least 2 characters",
        errorDetails: null,
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Please provide a valid email address",
        errorDetails: null,
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Password must contain at least 8 characters",
        errorDetails: null,
      });
    }

    if (!["CUSTOMER", "PROVIDER"].includes(role)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Role must be CUSTOMER or PROVIDER",
        errorDetails: null,
      });
    }

    if (
      profile !== undefined &&
      (
        typeof profile !== "object" ||
        profile === null ||
        Array.isArray(profile) ||
        (profile.bio !== undefined && typeof profile.bio !== "string") ||
        (profile.phone !== undefined && typeof profile.phone !== "string")
      )
    ) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid profile information",
        errorDetails: null,
      });
    }

    const user = await userService.registerUserIntoDB({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      profile,
    });

    return res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    const statusCode =
      error instanceof userService.AppError
        ? error.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message:
        error instanceof Error
          ? error.message
          : "Failed to register user",
      errorDetails: null,
    });
  }
};

export const userController = {
  registerUser,
};
