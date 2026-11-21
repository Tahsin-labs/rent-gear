import { Router } from "express";
import { gearController } from "./gear.controller";
import auth from "../../middlewares/auth";
import  authorize  from "../../middlewares/role";

const router = Router();

router.post(
  "/gear",
  auth,
  authorize("PROVIDER"),
  gearController.createGear
);

router.get("/gear", gearController.getAllGear);
router.get("/gear/:id", gearController.getGearById);


router.patch(
  "/gear/:id",
  auth,
  authorize("PROVIDER"),
  gearController.updateGear
);

router.delete(
  "/gear/:id",
  auth,
  authorize("PROVIDER"),
  gearController.deleteGear
);

export const gearRouter = router;