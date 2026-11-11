
import { prisma } from "../../lib/prisma";
import { CreateRentalPayload } from "./rental.interface";
import { Prisma, RentalStatus } from "../../../generated/prisma/client";

const createRental = async (
  payload: CreateRentalPayload,
  customerId: string
) => {
  const { gearId, startDate, endDate } = payload;

  // 1. Validate required fields
  if (!gearId || !startDate || !endDate) {
    throw new Error("Gear ID, start date and end date are required");
  }

  // 2. Validate date format
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error("Invalid date format");
  }

  // 3. Normalize dates to UTC calendar days
  const startDay = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  );

  const endDay = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate()
  );

  const today = new Date();
  const todayDay = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  if (startDay < todayDay) {
    throw new Error("Start date cannot be in the past");
  }

  if (endDay <= startDay) {
    throw new Error("End date must be after start date");
  }

  // End date is exclusive
  const rentalDays = (endDay - startDay) / (1000 * 60 * 60 * 24);

  // 4. Check gear
  const gear = await prisma.gearItem.findUnique({
    where: { id: gearId },
  });

  if (!gear || !gear.isAvailable) {
    throw new Error("Gear not found or unavailable");
  }

  if (gear.providerId === customerId) {
    throw new Error("You cannot rent your own gear");
  }

  // 5. Check overlapping active bookings and stock
  const overlappingRentals = await prisma.rental.count({
    where: {
      gearId,
      status: {
        in: [
          RentalStatus.PENDING,
          RentalStatus.CONFIRMED,
          RentalStatus.ACTIVE,
        ],
      },
      startDate: { lt: new Date(endDay) },
      endDate: { gt: new Date(startDay) },
    },
  });

  if (overlappingRentals >= gear.stock) {
    throw new Error("Gear is not available for the selected dates");
  }

  // 6. Calculate total price on backend
  const totalPrice = new Prisma.Decimal(gear.pricePerDay.toString())
    .mul(rentalDays);

  // 7. Create booking
  return prisma.rental.create({
    data: {
      gearId,
      customerId,
      startDate: new Date(startDay),
      endDate: new Date(endDay),
      totalPrice,
    },
    include: {
      gear: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          pricePerDay: true,
        },
      },
    },
  });
};

// Get rentals of logged-in customer
const getMyRentals = async (customerId: string) => {
  return prisma.rental.findMany({
    where: { customerId },
    include: {
      gear: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          pricePerDay: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get one rental belonging to logged-in customer
const getMyRentalById = async (
  rentalId: string,
  customerId: string
) => {
  const rental = await prisma.rental.findFirst({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      gear: true,
    },
  });

  if (!rental) {
    throw new Error("Rental not found");
  }

  return rental;
};

export const rentalService = {
  createRental,
  getMyRentals,
  getMyRentalById,
};
