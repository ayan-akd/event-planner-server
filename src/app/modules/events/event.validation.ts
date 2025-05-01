import { EventType } from "@prisma/client";
import { z } from "zod";

const eventCreateZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title Is Required" }),
    image: z.string({ required_error: "Image Is Required" }),
    description: z.string({ required_error: "Description Is Required" }),
    type: z.enum([EventType.OFFLINE, EventType.ONLINE], {
      required_error: "Type Is Required",
    }),
    fee: z.number({ required_error: "Fee Is Required" }),
    date: z.string({ required_error: "Date Is Required" }),
    venueOrLink: z.string({ required_error: "VenueOrLink Is Required" }),
  }),
});

export const EventValidation = {
  eventCreateZodSchema,
};
