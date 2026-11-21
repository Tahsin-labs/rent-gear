
import { Request, Response } from "express";
import { paymentService } from "./payment.service";

const createPayment = async (req: Request, res: Response) => {
  try {
    const result = await paymentService.createPayment(
      req.body,
      res.locals.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Checkout session created",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Payment failed",
    });
  }
};

const getMyPayments = async (_req: Request, res: Response) => {
  try {
    const result = await paymentService.getMyPayments(res.locals.user.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Request failed",
    });
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    if (typeof paymentId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }

    const result = await paymentService.getPaymentById(
      paymentId,
      res.locals.user.id
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Payment not found",
    });
  }
};

const successCallback = async (req: Request, res: Response) => {
  try {
    const { val_id, tran_id } = req.body;

    if (typeof val_id !== "string" || typeof tran_id !== "string") {
      throw new Error("Invalid callback data");
    }

    const completed = await paymentService.verifyAndCompletePayment(val_id, tran_id);
    const orderId = completed?.rentalId || "";

    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?tran_id=${tran_id}&orderId=${orderId}`
    );
  } catch {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/fail`);
  }
};

const failCallback = async (req: Request, res: Response) => {
  const { tran_id } = req.body;

  if (typeof tran_id === "string") {
    try {
      await paymentService.markPaymentFailed(tran_id);
    } catch {
      // Do not trust callback as proof of payment.
    }
  }

  return res.redirect(
    `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/fail${
      tran_id ? `?tran_id=${tran_id}` : ""
    }`
  );
};

const cancelCallback = async (req: Request, res: Response) => {
  const { tran_id } = req.body;

  if (typeof tran_id === "string") {
    try {
      await paymentService.markPaymentFailed(tran_id);
    } catch {
      // Do not trust callback as proof of payment.
    }
  }

  return res.redirect(
    `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/cancel${
      tran_id ? `?tran_id=${tran_id}` : ""
    }`
  );
};

const ipnCallback = async (req: Request, res: Response) => {
  try {
    const { val_id, tran_id } = req.body;

    if (typeof val_id !== "string" || typeof tran_id !== "string") {
      throw new Error("Invalid IPN data");
    }

    await paymentService.verifyAndCompletePayment(val_id, tran_id);

    return res.status(200).send("IPN verified");
  } catch (error) {
    return res.status(400).send(
      error instanceof Error ? error.message : "IPN verification failed"
    );
  }
};

export const paymentController = {
  createPayment,
  getMyPayments,
  getPaymentById,
  successCallback,
  failCallback,
  cancelCallback,
  ipnCallback,
};
