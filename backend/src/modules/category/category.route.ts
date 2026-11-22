import { Router } from "express";
import { categoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import  authorize  from "../../middlewares/role";

const router = Router();

router.get("/categories", categoryController.getAllCategories);

router.post(
  "/categories",
  auth,
  authorize("ADMIN"),
  categoryController.createCategory
);

export const categoryRouter = router;