import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@gearup.com";
    const password = process.env.ADMIN_PASSWORD || "admin123456";
    const name = process.env.ADMIN_NAME || "GearUp Admin";

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    if (password.length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`Admin user with email ${email} already exists.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("Admin created successfully:");
    console.log(admin);
  } catch (error) {
    console.error("Admin creation failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();