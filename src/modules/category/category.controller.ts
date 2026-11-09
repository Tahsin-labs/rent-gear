import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    // Required field validation
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required",
      });
    }

    // Type validation
    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      (description !== undefined &&
        typeof description !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid field types",
      });
    }

    const cleanName = name.trim();
    const cleanSlug = slug.trim().toLowerCase();

    if (!cleanName || !cleanSlug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug cannot be empty",
      });
    }

    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug can contain only lowercase letters, numbers and hyphens",
      });
    }

    const category = await categoryService.createCategory({
      name: cleanName,
      slug: cleanSlug,
      description: description?.trim() || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    // Duplicate name or slug
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const categoryController = {
  createCategory,
};