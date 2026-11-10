
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { gearRouter } from "./modules/gear/gear.route";
import { categoryRouter } from "./modules/category/category.route";
const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GearUp API is running!",
  });
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/provider", gearRouter);
app.use("/api/admin", categoryRouter);

export default app;
