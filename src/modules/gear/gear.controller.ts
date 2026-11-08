import { Request, Response } from "express";
import { gearService } from "./gear.service";

const createGear = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      brand,
      imageUrl,
      pricePerDay,
      stock,
      categoryId,
    } = req.body;

    // Required field validation
    if (
      !name ||
      !description ||
      !brand ||
      !imageUrl ||
      pricePerDay === undefined ||
      stock === undefined ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Type and value validation
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof brand !== "string" ||
      typeof imageUrl !== "string" ||
      typeof categoryId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid field types",
      });
    }

    if (
      typeof pricePerDay !== "number" ||
      !Number.isFinite(pricePerDay) ||
      pricePerDay <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a positive integer",
      });
    }

    if (!/^https?:\/\/\S+$/i.test(imageUrl)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid image URL",
      });
    }

    const gear = await gearService.createGear(
      {
        name: name.trim(),
        description: description.trim(),
        brand: brand.trim(),
        imageUrl: imageUrl.trim(),
        pricePerDay,
        stock,
        categoryId: categoryId.trim(),
      },
      res.locals.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Gear created successfully",
      data: gear,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Category not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating gear",
    });
  }
};

export const gearController = {
  createGear,
};