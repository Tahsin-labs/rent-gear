
import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/role";
import { rentalController } from "./rental.controller";

const router = Router();

router.post(
  "/rentals",
  auth,
  authorize("CUSTOMER"),
  rentalController.createRental
);

router.get(
  "/rentals",
  auth,
  authorize("CUSTOMER"),
  rentalController.getMyRentals
);

router.get(
  "/rentals/:id",
  auth,
  authorize("CUSTOMER"),
  rentalController.getMyRentalById
);

export const rentalRouter = router;
