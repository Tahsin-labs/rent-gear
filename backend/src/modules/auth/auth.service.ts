
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { LoginPayload } from "./auth.interface";

class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

const loginUser = async (payload: LoginPayload) => {
  const { email, password } = payload;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  // Check account status
  if (user.activeStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked"
    );
  }

  // Verify password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password"
    );
  }

  if (!config.jwt_access_secret) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "JWT secret is not configured"
    );
  }

  // Generate JWT
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt_access_secret,
    {
      expiresIn: "7d",
    }
  );

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken,
    user: userWithoutPassword,
  };
};

export const authService = {
  loginUser,
  AppError,
};
