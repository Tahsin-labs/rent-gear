
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Category slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can contain only lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export type CreateCategoryInput = z.infer<
  typeof createCategorySchema
>;
