
// import { Router } from "express";
// import auth from "../../middlewares/auth";
// import authorize from "../../middlewares/role";
// import { rentalController } from "./rental.controller";

// const router = Router();

// router.post(
//   "/rentals",
//   auth,
//   authorize("CUSTOMER"),
//   rentalController.createRental
// );

// router.get(
//   "/rentals",
//   auth,
//   authorize("CUSTOMER"),
//   rentalController.getMyRentals
// );

// router.get(
//   "/rentals/:id",
//   auth,
//   authorize("CUSTOMER"),
//   rentalController.getMyRentalById
// );

// router.get(
//   "/provider/rentals",
//   auth,
//   authorize("PROVIDER"),
//   rentalController.getProviderRentals
// );

// router.patch(
//   "/provider/rentals/:id/status",
//   auth,
//   authorize("PROVIDER"),
//   rentalController.updateRentalStatus
// );

// export const rentalRouter = router;


import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/role";
import { rentalController } from "./rental.controller";

const customerRouter = Router();
const providerRouter = Router();

// Customer routes
customerRouter.post(
    "/rentals",
    auth,
    authorize("CUSTOMER"),
    rentalController.createRental
);

customerRouter.get(
    "/rentals",
    auth,
    authorize("CUSTOMER"),
    rentalController.getMyRentals
);

customerRouter.get(
    "/rentals/:id",
    auth,
    authorize("CUSTOMER"),
    rentalController.getMyRentalById
);

// Provider routes
providerRouter.get(
    "/rentals",
    auth,
    authorize("PROVIDER"),
    rentalController.getProviderRentals
);

providerRouter.patch(
    "/rentals/:id/status",
    auth,
    authorize("PROVIDER"),
    rentalController.updateRentalStatus
);

export {
    customerRouter as customerRentalRouter,
    providerRouter as providerRentalRouter,
};