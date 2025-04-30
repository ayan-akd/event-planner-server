import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/sign-up",
  validateRequest(AuthValidation.signUpZodSchema),
  AuthController.signUpController
);

router.post(
  "/sign-in",
  validateRequest(AuthValidation.signInZodSchema),
  AuthController.logInController
);

router.post(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePasswordController
);

export const AuthRoutes = router;
