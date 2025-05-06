import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.getAllUsers
);



router.get(
  "/invite",
  auth(UserRole.USER),
  UserController.getUsersForInvitation
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);

router.patch(
  "/change-status/:id",
  auth(UserRole.ADMIN),
  validateRequest(UserValidation.changeStatusZodSchema),
  UserController.changeUserStatus
);

router.delete("/:id", auth(UserRole.ADMIN), UserController.deleteUser);
router.get("/:id", UserController.getSingleUser);

export const UserRoutes = router;
