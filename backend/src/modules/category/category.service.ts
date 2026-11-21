
import { prisma } from "../../lib/prisma";
import { CreateCategoryInput } from "./category.validation";

const createCategory = async (payload: CreateCategoryInput) => {
  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description || null,
    },
  });

  return category;
};

export const categoryService = {
  createCategory,
};
