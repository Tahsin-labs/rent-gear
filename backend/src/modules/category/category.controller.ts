
import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { createCategorySchema } from "./category.validation";

const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        errorDetails: validation.error.issues,
      });
    }

    const category = await categoryService.createCategory(
      validation.data
    );

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Category name or slug already exists",
        errorDetails: null,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to create category",
      errorDetails: null,
    });
  }
};

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve categories",
      errorDetails: null,
    });
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
};
