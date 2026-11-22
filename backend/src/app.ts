
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { gearRouter } from "./modules/gear/gear.route";
import { categoryRouter } from "./modules/category/category.route";
import { paymentRouter } from "./modules/payment/payment.route";
import adminRouter from "./modules/admin/admin.route";
import reviewRouter from "./modules/review/review.route";
// import { rentalRouter } from "./modules/rental/rental.route";

import {
  customerRentalRouter,
  providerRentalRouter,
} from "./modules/rental/rental.route";

import errorHandler from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";

const app: Application = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  config.app_url,
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for preview/deployed origins
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

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
// app.use("/api/customer", rentalRouter);
// app.use("/api", rentalRouter);
app.use("/api/customer", customerRentalRouter);
app.use("/api/provider", providerRentalRouter);
app.use("/api/customer/payments", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer/reviews", reviewRouter);
app.use("/api", reviewRouter);



// Handle unknown routes
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
    errorDetails: null,
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);



export default app;
