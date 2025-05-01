import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { InvitationController } from "./invitation.controller";
import { InvitationValidation } from "./invitation.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  InvitationController.getAllInvitations
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  InvitationController.getSingleInvitation
);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(InvitationValidation.createInvitationZodSchema),
  InvitationController.createInvitation
);

router.patch(
  "/:id",
  auth(UserRole.USER),
  validateRequest(InvitationValidation.updateInvitationZodSchema),
  InvitationController.updateInvitation
);

router.delete(
  "/delete/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  InvitationController.deleteInvitation
);

export const InvitationRoutes = router;
