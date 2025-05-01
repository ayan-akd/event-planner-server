import { Router } from "express";
import { ParticipantControllers } from "./participant.controller";
// import auth from "../../middlewares/auth";
// import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ParticipantValidation } from "./participant.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
    "/create-participant",
    auth(UserRole.USER),
    validateRequest(ParticipantValidation.createParticipantSchema),
    ParticipantControllers.createParticipant
    );

router.get("/",
    auth(UserRole.USER, UserRole.ADMIN),
    ParticipantControllers.getAllParticipants);

router.get("/:id",
    auth(UserRole.USER, UserRole.ADMIN),
    ParticipantControllers.getSingleParticipant);

router.patch(
  "/:id",
    auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ParticipantValidation.updateParticipantSchema),
  ParticipantControllers.updateParticipant
);

router.patch("/:id",
    auth(UserRole.ADMIN),
    ParticipantControllers.deleteParticipant);

export const ParticipantRoutes = router;