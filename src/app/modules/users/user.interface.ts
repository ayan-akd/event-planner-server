import { UserRole } from "@prisma/client";

export interface TUserFromToken {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  }
  