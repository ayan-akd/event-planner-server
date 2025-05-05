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
  "/my-created-invites",
  auth(UserRole.USER),
  InvitationController.getPendingMyCreatedInvites
);

router.get(
  "/my-received-invites",
  auth(UserRole.USER),
  InvitationController.getPendingMyReceivedInvites
);

router.post(
  "/",
  auth(UserRole.USER),
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

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  InvitationController.getSingleInvitation
);

export const InvitationRoutes = router;
