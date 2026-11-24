
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { sslcommerzConfig } from "../../config/sslcommerz";
import type { CreatePaymentPayload } from "./payment.interface";
import {
  PaymentProvider,
  PaymentStatus,
} from "../../../generated/prisma/client";

// Create checkout session
const createPayment = async (
  payload: CreatePaymentPayload,
  customerId: string
) => {
  const { rentalId } = payload;

  if (!rentalId) throw new Error("Rental ID is required");

  if (!sslcommerzConfig.storeId || !sslcommerzConfig.storePassword) {
    throw new Error("SSLCommerz credentials are not configured");
  }

  const rental = await prisma.rental.findFirst({
    where: { id: rentalId, customerId },
    include: {
      payment: true,
      customer: {
        select: {
          name: true,
          email: true,
          profile: { select: { phone: true } },
        },
      },
      gear: { select: { name: true } },
    },
  });

  if (!rental) throw new Error("Rental not found");
  if (rental.status !== "CONFIRMED" && rental.status !== "PENDING") {
    throw new Error("Only pending or confirmed rentals can be paid");
  }

  const customer = rental.customer;
  const phone = customer.profile?.phone || "01700000000";

  if (!customer.name || !customer.email) {
    throw new Error("Customer name and email are required");
  }

  if (rental.payment?.status === PaymentStatus.COMPLETED) {
    throw new Error("Rental has already been paid");
  }

  const tranId = `GEARUP-${randomUUID()}`;

  // Save pending payment
  const payment = rental.payment
    ? await prisma.payment.update({
        where: { id: rental.payment.id },
        data: {
          provider: PaymentProvider.SSLCOMMERZ,
          status: PaymentStatus.PENDING,
          transactionId: tranId,
          paidAt: null,
        },
      })
    : await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: rental.totalPrice,
          provider: PaymentProvider.SSLCOMMERZ,
          status: PaymentStatus.PENDING,
          transactionId: tranId,
        },
      });

  try {
    const requestData = new URLSearchParams({
      store_id: sslcommerzConfig.storeId,
      store_passwd: sslcommerzConfig.storePassword,
      total_amount: rental.totalPrice.toString(),
      currency: "BDT",
      tran_id: tranId,
      success_url: sslcommerzConfig.successUrl,
      fail_url: sslcommerzConfig.failUrl,
      cancel_url: sslcommerzConfig.cancelUrl,
      ipn_url: sslcommerzConfig.ipnUrl,
      cus_name: customer.name,
      cus_email: customer.email,
      cus_phone: phone,
      cus_add1: "Not provided",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: rental.gear.name,
      product_category: "Sports Equipment Rental",
      product_profile: "general",
      num_of_item: "1",
    });

    const response = await fetch(
      `${sslcommerzConfig.baseUrl}/gwprocess/v4/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestData.toString(),
      }
    );

    const result = (await response.json()) as {
      status?: string;
      failedreason?: string;
      GatewayPageURL?: string;
    };

    if (!response.ok || result.status !== "SUCCESS" || !result.GatewayPageURL) {
      throw new Error(result.failedreason || "SSLCommerz session creation failed");
    }

    return {
      transactionId: tranId,
      amount: rental.totalPrice.toString(),
      currency: "BDT",
      status: "PENDING",
      checkoutUrl: result.GatewayPageURL,
    };
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });
    throw error;
  }
};

// Verify transaction with SSLCommerz
const verifyAndCompletePayment = async (
  valId: string,
  transactionId: string
) => {
  if (!valId || !transactionId) {
    throw new Error("Validation ID and transaction ID are required");
  }

  const payment = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (!payment) throw new Error("Payment not found");

  if (payment.status === PaymentStatus.COMPLETED) return payment;

  const url = new URL(
    `${sslcommerzConfig.baseUrl}/validator/api/validationserverAPI.php`
  );

  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", sslcommerzConfig.storeId);
  url.searchParams.set("store_passwd", sslcommerzConfig.storePassword);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error("SSLCommerz validation failed");

  const result = (await response.json()) as {
    status?: string;
    tran_id?: string;
    val_id?: string;
    amount?: string;
    currency?: string;
    risk_level?: string;
  };

  if (!["VALID", "VALIDATED"].includes(result.status || "")) {
    throw new Error("Payment is not valid");
  }

  if (result.tran_id !== payment.transactionId || result.val_id !== valId) {
    throw new Error("Transaction validation mismatch");
  }

  if (result.currency !== "BDT") throw new Error("Currency mismatch");

  if (
    Number(result.amount).toFixed(2) !==
    Number(payment.amount).toFixed(2)
  ) {
    throw new Error("Payment amount mismatch");
  }

  if (result.risk_level === "1") {
    throw new Error("Payment requires manual review");
  }

  // Conditional update prevents overwriting a newer checkout attempt
  const updated = await prisma.payment.updateMany({
    where: {
      id: payment.id,
      transactionId,
      status: PaymentStatus.PENDING,
    },
    data: {
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });

  if (updated.count === 0) {
    const latest = await prisma.payment.findUnique({
      where: { id: payment.id },
    });

    if (latest?.status === PaymentStatus.COMPLETED) return latest;

    throw new Error("Payment changed during verification");
  }

  return prisma.payment.findUniqueOrThrow({
    where: { id: payment.id },
  });
};

// Mark failed payment
const markPaymentFailed = async (transactionId: string) => {
  if (!transactionId) throw new Error("Transaction ID is required");

  const payment = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (!payment) throw new Error("Payment not found");

  if (payment.status === PaymentStatus.COMPLETED) {
    throw new Error("Completed payment cannot be marked as failed");
  }

  return prisma.payment.updateMany({
    where: {
      id: payment.id,
      transactionId,
      status: PaymentStatus.PENDING,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};

// Get payment history
const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: { rental: { customerId } },
    include: {
      rental: {
        include: {
          gear: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get one payment
const getPaymentById = async (paymentId: string, customerId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      rental: { customerId },
    },
    include: { rental: true },
  });

  if (!payment) throw new Error("Payment not found");

  return payment;
};

export const paymentService = {
  createPayment,
  verifyAndCompletePayment,
  markPaymentFailed,
  getMyPayments,
  getPaymentById,
};
