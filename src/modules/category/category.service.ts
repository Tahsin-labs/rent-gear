import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload } from "./category.interface";

const createCategory = async (payload: CreateCategoryPayload) => {
  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
    },
  });

  return category;
};

export const categoryService = {
  createCategory,
};