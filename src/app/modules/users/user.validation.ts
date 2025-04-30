import { z } from "zod";

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

const changeStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "BLOCKED"] as [string, ...string[]], {
      required_error: "status is required",
    }),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
  changeStatusZodSchema,
};