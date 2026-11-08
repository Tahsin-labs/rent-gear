import { prisma } from "../../lib/prisma";
import { CreateGearPayload } from "./gear.interface";

const createGear = async (
  payload: CreateGearPayload,
  providerId: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const gear = await prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      imageUrl: payload.imageUrl,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,
      categoryId: payload.categoryId,
      providerId: providerId,
    },
  });

  return gear;
};

export const gearService = {
  createGear,
};