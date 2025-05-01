import { z } from "zod";

export const createParticipantSchema = z.object({
  body: z.object({
    eventId: z.string({
      required_error: "Event ID is required",
    }),
    userId: z.string({
      required_error: "User ID is required",
    }),
    inviteId: z.string().nullable().optional(),
  }),
});

const updateParticipantSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "BANNED"]).optional(),
    hasPaid: z.boolean().optional(),
  }),
});

export const ParticipantValidation = {
  createParticipantSchema,
  updateParticipantSchema,
};
