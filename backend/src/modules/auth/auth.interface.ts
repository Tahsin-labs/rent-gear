
import { Role } from "../../../generated/prisma/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}
