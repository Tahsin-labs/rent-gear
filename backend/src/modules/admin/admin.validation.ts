
import { z } from "zod";

export const updateUserStatusSchema = z.object({
  activeStatus: z.enum(["ACTIVE", "BLOCKED"]),
});

export type UpdateUserStatusInput = z.infer<
  typeof updateUserStatusSchema
>;
