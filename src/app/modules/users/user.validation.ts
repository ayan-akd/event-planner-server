import { z } from "zod";

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const UserValidation = {
  updateUserZodSchema,
};