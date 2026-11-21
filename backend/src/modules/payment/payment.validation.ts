
import { CreatePaymentPayload } from "./payment.interface";

export const validateCreatePayment = (
  payload: CreatePaymentPayload
): string | null => {
  if (!payload.rentalId) {
    return "Rental ID is required";
  }

  if (typeof payload.rentalId !== "string") {
    return "Rental ID must be a string";
  }

  return null;
};
