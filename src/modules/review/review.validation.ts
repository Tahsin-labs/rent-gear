
import { z } from "zod";

export const createReviewSchema = z.object({
  rentalId: z.string().uuid("Invalid rental ID"),
  gearId: z.string().uuid("Invalid gear ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;
