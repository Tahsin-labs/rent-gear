
import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";
import { createReviewSchema } from "./review.validation";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = createReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errorDetails: validation.error.issues,
      });
    }

    const customerId = res.locals.user.id;

    const result = await ReviewService.createReview(
      customerId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getGearReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gearId } = req.params;

    const result = await ReviewService.getGearReviews(
      gearId as string
    );

    res.status(200).json({
      success: true,
      message: "Gear reviews retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getGearReviews,
};
