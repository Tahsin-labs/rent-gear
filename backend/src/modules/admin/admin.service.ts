
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatus = async (
  userId: string,
  activeStatus: "ACTIVE" | "BLOCKED"
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "ADMIN") {
    throw new Error("Admin account status cannot be changed");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { activeStatus },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      activeStatus: true,
    },
  });
};

const getAllGear = async () => {
  return prisma.gearItem.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllRentals = async () => {
  return prisma.rental.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      gear: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
