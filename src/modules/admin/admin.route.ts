
import { Router } from "express";
import { AdminController } from "./admin.controller";

import auth from "../../middlewares/auth";
import authorize from "../../middlewares/role";

const router = Router();

// Only authenticated ADMIN users can access these routes
router.use(auth, authorize("ADMIN"));

router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id", AdminController.updateUserStatus);

router.get("/gear", AdminController.getAllGear);
router.get("/rentals", AdminController.getAllRentals);

export default router;
