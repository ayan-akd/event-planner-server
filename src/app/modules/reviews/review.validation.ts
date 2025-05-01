import { z } from "zod";

const createReviewZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "userId is required",
    }),
    eventId: z.string({
      required_error: "eventId is required",
    }),
    rating: z.number({
      required_error: "rating is required",
    }),
    comment: z.string({
      required_error: "comment is required",
    }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
};