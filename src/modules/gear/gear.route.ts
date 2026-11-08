import { Router } from "express";
import { gearController } from "./gear.controller";
import auth from "../../middlewares/auth";
import { authorize } from "../../middlewares/role";

const router = Router();

router.post(
  "/gear",
  auth,
  authorize("PROVIDER"),
  gearController.createGear
);

export const gearRouter = router;