
import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/login", authController.loginUser);

router.get("/me", auth, (req, res) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "User profile fetched successfully",
    data: res.locals.user,
  });
});

export const authRouter = router;
