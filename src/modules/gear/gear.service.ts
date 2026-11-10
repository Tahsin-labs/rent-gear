import { prisma } from "../../lib/prisma";
import { CreateGearPayload ,UpdateGearPayload} from "./gear.interface";

const createGear = async (payload: CreateGearPayload, providerId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) throw new Error("Category not found");

  return prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      imageUrl: payload.imageUrl,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,
      categoryId: payload.categoryId,
      providerId,
    },
  });
};

// Get all available gear with filters
const getAllGear = async (filters: {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}) => {
  const { search, categoryId, brand, minPrice, maxPrice, page, limit } = filters;

  const where = {
    isAvailable: true,
    ...(categoryId ? { categoryId } : {}),
    ...(brand
      ? { brand: { contains: brand, mode: "insensitive" as const } }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          pricePerDay: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const [gear, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.gearItem.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: gear,
  };
};

//.....................

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!gear || !gear.isAvailable) {
    throw new Error("Gear not found");
  }

  return gear;
};


//.............


const updateGear = async (
  id: string,
  providerId: string,
  payload: UpdateGearPayload
) => {
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      id,
      providerId,
    },
  });

  if (!existingGear) {
    throw new Error("Gear not found or you are not the owner");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  return prisma.gearItem.update({
    where: { id },
    data: payload,
  });
};




export const gearService = { createGear, getAllGear,getGearById,updateGear, };