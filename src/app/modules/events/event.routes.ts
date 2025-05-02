import { Router } from "express";
// import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { EventController } from "./event.controllers";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { EventValidation } from "./event.validation";
// import validateRequest from "../../middlewares/validateRequest";
// import { ReviewValidation } from "./review.validation";

//  Init Router
const eventRouter = Router();

//  Create Event
eventRouter.post(
  "/create",
  auth(UserRole.USER),
  validateRequest(EventValidation.eventCreateZodSchema),
  EventController.createEvent
);
// Get All Events Route
eventRouter.get("/", EventController.getAllEvents);
// Get Logged In User Route
eventRouter.get(
  "/my-events",
  auth(UserRole.USER),
  EventController.getLoggedInUserEvents
);

// Get Single Event Route
eventRouter.get("/:eventId", EventController.getSingleEvent);

// Hard Delete Single Event Route
eventRouter.delete(
  "/:eventId",
  auth(UserRole.USER),
  EventController.hardDeleteEvent
);

// Soft Delete Single Event Route
eventRouter.delete(
  "/:eventId/soft",
  auth(UserRole.USER),
  EventController.softDeleteEvent
);

//Update Single Event Route
eventRouter.patch(
  "/:eventId",
  auth(UserRole.USER),
  validateRequest(EventValidation.eventUpdateZodSchema),
  EventController.updateSingleEvent
);

//Update Single Event Status Route
eventRouter.patch(
  "/:eventId/hero",
  auth(UserRole.ADMIN),
  validateRequest(EventValidation.heroEventStatusUpdateZodSchema),
  EventController.updateSingleEventHeroStatus
);

// Export Route
export const EventRoutes = eventRouter;
