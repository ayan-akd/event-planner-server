import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getSingleUser);

router.post(
  "/",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

router.put("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export const UserRoutes = router;
