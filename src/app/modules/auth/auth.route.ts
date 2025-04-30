import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

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

export const AuthRoutes = router;
