import { Router } from "express";
// import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { EventController } from "./event.controllers";
import { UserRole } from "@prisma/client";
// import validateRequest from "../../middlewares/validateRequest";
// import { ReviewValidation } from "./review.validation";

//  Init Router
const eventRouter = Router();

//  Create Event
eventRouter.post("/create", auth(UserRole.USER), EventController.createEvent);
// Get All Events Route
eventRouter.get("/", EventController.getAllEvents);
// Get Logged In User Route
eventRouter.get(
  "/my-events",
  auth(UserRole.USER),
  EventController.getLoggedInUserEvents
);

// Export Route
export const EventRoutes = eventRouter;
