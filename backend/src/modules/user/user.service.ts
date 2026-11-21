
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role, profile } = payload;

  // Check existing user
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(409, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    config.bcrypt_salt_rounds
  );

  // Create user and profile together
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,

      profile: {
        create: {
          bio: profile?.bio,
          phone: profile?.phone,
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true,
      createdAt: true,
      updatedAt: true,

      profile: {
        select: {
          id: true,
          bio: true,
          phone: true,
        },
      },
    },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
  AppError,
};
