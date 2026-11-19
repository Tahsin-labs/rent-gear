
import { prisma } from "../../lib/prisma";
import { CreateReviewInput } from "./review.validation";

const createReview = async (
  customerId: string,
  payload: CreateReviewInput
) => {
  const rental = await prisma.rental.findUnique({
    where: {
      id: payload.rentalId,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  if (rental.customerId !== customerId) {
    throw new Error("You can only review your own rental");
  }

  if (rental.gearId !== payload.gearId) {
    throw new Error("This gear does not belong to the rental");
  }

  if (rental.status !== "COMPLETED") {
    throw new Error("You can review only after returning the gear");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      rentalId: payload.rentalId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this rental");
  }

  return prisma.review.create({
    data: {
      customerId,
      gearId: payload.gearId,
      rentalId: payload.rentalId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      gear: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getGearReviews = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
    select: {
      id: true,
    },
  });

  if (!gear) {
    throw new Error("Gear not found");
  }

  return prisma.review.findMany({
    where: {
      gearId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const ReviewService = {
  createReview,
  getGearReviews,
};
