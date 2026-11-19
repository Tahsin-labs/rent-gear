
import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/role";

const router = Router();

// Customer can create reviews
router.post(
  "/",
  auth,
  authorize("CUSTOMER"),
  ReviewController.createReview
);

// Public users can view gear reviews
router.get(
  "/gear/:gearId",
  ReviewController.getGearReviews
);

router.get(
  "/gear/:gearId/reviews",
  ReviewController.getGearReviews
);

export default router;
