
import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.updateUserStatus(
      req.params.id as string,
      req.body.activeStatus
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllGear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.getAllGear();

    res.status(200).json({
      success: true,
      message: "Gear retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRentals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.getAllRentals();

    res.status(200).json({
      success: true,
      message: "Rentals retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
