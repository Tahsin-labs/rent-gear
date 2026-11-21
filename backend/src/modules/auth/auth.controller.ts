
import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import { loginValidationSchema } from "./auth.validation";

const loginUser = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = loginValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed",
        errorDetails: validation.error.issues,
      });
    }

    const result = await authService.loginUser(validation.data);

    // Store token in HTTP-only cookie
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const statusCode =
      error instanceof authService.AppError
        ? error.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message: error instanceof Error ? error.message : "Login failed",
      errorDetails: null,
    });
  }
};

export const authController = {
  loginUser,
};
