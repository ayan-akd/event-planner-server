import { EventType } from "@prisma/client";
import { z } from "zod";

// Create Event Validation Schema
const eventCreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Is Required" }),
    image: z.string({ required_error: "Image Is Required" }),
    description: z.string({ required_error: "Description Is Required" }),
    type: z.enum([EventType.OFFLINE, EventType.ONLINE], {
      required_error: "Type Is Required",
    }),
    fee: z.number().min(0).optional(),
    date: z.string({ required_error: "Date Is Required" }),
    venueOrLink: z.string({ required_error: "VenueOrLink Is Required" }),
  }),
});

// Update Event Validation Schema
const eventUpdateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Is Required" }).optional(),
    image: z.string({ required_error: "Image Is Required" }).optional(),
    description: z
      .string({ required_error: "Description Is Required" })
      .optional(),
    type: z
      .enum([EventType.OFFLINE, EventType.ONLINE], {
        required_error: "Type Is Required",
      })
      .optional(),
    fee: z.number().min(0).optional(),
    date: z.string({ required_error: "Date Is Required" }).optional(),
    venueOrLink: z
      .string({ required_error: "VenueOrLink Is Required" })
      .optional(),
  }),
});

export const EventValidation = {
  eventCreateZodSchema,
  eventUpdateZodSchema,
};
