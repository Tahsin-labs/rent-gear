
import { Request, Response } from "express";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";

const createRental = async (req: Request, res: Response) => {
  try {
    const customerId = res.locals.user.id;

    const result = await rentalService.createRental(
      req.body,
      customerId
    );

    return res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental booking created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message:
        error instanceof Error ? error.message : "Something went wrong",
      errorDetails: null,
    });
  }
};

const getMyRentals = async (req: Request, res: Response) => {
  try {
    const customerId = res.locals.user.id;

    const result = await rentalService.getMyRentals(customerId);

    return res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "My rentals retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message:
        error instanceof Error ? error.message : "Something went wrong",
      errorDetails: null,
    });
  }
};

const getMyRentalById = async (req: Request, res: Response) => {
  try {
    const customerId = res.locals.user.id;

    const result = await rentalService.getMyRentalById(
      req.params.id as string,
      customerId
    );

    return res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message:
        error instanceof Error ? error.message : "Rental not found",
      errorDetails: null,
    });
  }
};

export const rentalController = {
  createRental,
  getMyRentals,
  getMyRentalById,
};
