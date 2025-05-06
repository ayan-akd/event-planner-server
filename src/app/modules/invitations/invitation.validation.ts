import { z } from "zod";

const createInvitationZodSchema = z.object({
  body: z.object({
    participantId: z.string({
      required_error: "participantId is required",
    }),
    eventId: z.string({
      required_error: "eventId is required",
    }),
  }),
});

const updateInvitationZodSchema = z.object({
  body: z.object({
    status: z
      .enum(["ACCEPTED", "REJECTED"] as [string, ...string[]])
      .optional(),
    hasRead: z.boolean().optional(),
  }),
});

export const InvitationValidation = {
  createInvitationZodSchema,
  updateInvitationZodSchema,
};
