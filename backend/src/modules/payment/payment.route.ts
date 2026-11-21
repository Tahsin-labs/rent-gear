
import { Router } from "express";
import { paymentController } from "./payment.controller";
import  auth  from "../../middlewares/auth";
import  authorize  from "../../middlewares/role";

const router = Router();

// Public SSLCommerz callbacks
router.post("/success", paymentController.successCallback);
router.post("/fail", paymentController.failCallback);
router.post("/cancel", paymentController.cancelCallback);
router.post("/ipn", paymentController.ipnCallback);

// Customer protected routes
router.post("/", auth, authorize("CUSTOMER"), paymentController.createPayment);
router.get("/", auth, authorize("CUSTOMER"), paymentController.getMyPayments);
router.get("/:id", auth, authorize("CUSTOMER"), paymentController.getPaymentById);

export const paymentRouter = router;
