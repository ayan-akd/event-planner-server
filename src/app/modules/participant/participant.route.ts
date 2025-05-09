import { Router } from "express";
import { ParticipantControllers } from "./participant.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ParticipantValidation } from "./participant.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-participant",
  // auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ParticipantValidation.createParticipantSchema),
  ParticipantControllers.createParticipant
);

// Refund
router.post(
  "/refund",
  auth(UserRole.ADMIN, UserRole.USER),
  ParticipantControllers.hardDeleteParticipantAndPaymentHistory
);

// Verify Payment
router.get(
  "/verify",
  auth(UserRole.ADMIN, UserRole.USER),
  ParticipantControllers.ParticipantPaymentVerify
);

router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  ParticipantControllers.getAllParticipants
);

// Get All Participants for Logged In User
router.get(
  "/my-participants",
  auth(UserRole.USER, UserRole.ADMIN),
  ParticipantControllers.getParticipantsForLoggedInUser
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ParticipantControllers.getSingleParticipant
);

router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ParticipantValidation.updateParticipantSchema),
  ParticipantControllers.updateParticipant
);

// hard delete
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ParticipantControllers.deleteParticipant
);

// soft delete
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  ParticipantControllers.deleteWithUpdateParticipant
);

export const ParticipantRoutes = router;
