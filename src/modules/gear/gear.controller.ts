import { Request, Response } from "express";
import { gearService } from "./gear.service";
import { UpdateGearPayload } from "./gear.interface";
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


//..................

const getAllGear = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const brand = req.query.brand as string | undefined;

    const minPrice =
      req.query.minPrice !== undefined
        ? Number(req.query.minPrice)
        : undefined;

    const maxPrice =
      req.query.maxPrice !== undefined
        ? Number(req.query.maxPrice)
        : undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (
      (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price range",
      });
    }

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    const result = await gearService.getAllGear({
      search,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Gear retrieved successfully",
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve gear",
    });
  }
};
//.............


const getGearById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;


    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid gear ID",
      });
    }
    const gear = await gearService.getGearById(id);

    return res.status(200).json({
      success: true,
      message: "Gear retrieved successfully",
      data: gear,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Gear not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve gear",
    });
  }
};


//................

const updateGear = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid gear ID",
      });
    }

    const payload = req.body as UpdateGearPayload;

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "brand",
      "imageUrl",
      "pricePerDay",
      "stock",
      "categoryId",
    ];

    const invalidFields = Object.keys(payload).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(", ")}`,
      });
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    if (
      payload.name !== undefined &&
      (typeof payload.name !== "string" || !payload.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string",
      });
    }

    if (
      payload.description !== undefined &&
      (typeof payload.description !== "string" || !payload.description.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a non-empty string",
      });
    }

    if (
      payload.brand !== undefined &&
      (typeof payload.brand !== "string" || !payload.brand.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Brand must be a non-empty string",
      });
    }

    if (
      payload.imageUrl !== undefined &&
      (typeof payload.imageUrl !== "string" ||
        !/^https?:\/\/\S+$/.test(payload.imageUrl))
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid image URL is required",
      });
    }

    if (
      payload.pricePerDay !== undefined &&
      (typeof payload.pricePerDay !== "number" ||
        !Number.isFinite(payload.pricePerDay) ||
        payload.pricePerDay <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (
      payload.stock !== undefined &&
      (!Number.isInteger(payload.stock) || payload.stock < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer",
      });
    }

    if (
      payload.categoryId !== undefined &&
      (typeof payload.categoryId !== "string" || !payload.categoryId.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid categoryId is required",
      });
    }

    const cleanPayload: UpdateGearPayload = {
      ...payload,
      ...(payload.name !== undefined && { name: payload.name.trim() }),
      ...(payload.description !== undefined && {
        description: payload.description.trim(),
      }),
      ...(payload.brand !== undefined && { brand: payload.brand.trim() }),
      ...(payload.imageUrl !== undefined && {
        imageUrl: payload.imageUrl.trim(),
      }),
      ...(payload.categoryId !== undefined && {
        categoryId: payload.categoryId.trim(),
      }),
    };

    const gear = await gearService.updateGear(
      id,
      res.locals.user.id,
      cleanPayload
    );

    return res.status(200).json({
      success: true,
      message: "Gear updated successfully",
      data: gear,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Gear not found or you are not the owner"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof Error && error.message === "Category not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update gear",
    });
  }
};
//.........

const deleteGear = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid gear ID",
      });
    }

    await gearService.deleteGear(id, res.locals.user.id);

    return res.status(200).json({
      success: true,
      message: "Gear deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Gear not found or you are not the owner"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gear",
    });
  }
};








export const gearController = {
  createGear, getAllGear, getGearById, updateGear, deleteGear,
};