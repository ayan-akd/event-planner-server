import { z } from "zod";
const signUpZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    username: z.string({
      required_error: "Username is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    profileImage: z.string().optional(),
  }),
});

const signInZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const AuthValidation = {
    signUpZodSchema,
    signInZodSchema,
};