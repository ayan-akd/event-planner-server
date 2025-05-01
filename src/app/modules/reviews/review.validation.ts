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
    }).min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string({
      required_error: "comment is required",
    }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
};