import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.getAllReviews
);
router.get(
  "/admin",
  auth(UserRole.ADMIN),
  ReviewController.getAllReviewsForAdmin
);
router.get(
  "/specific-event/:eventId",
  ReviewController.getAllReviewsForSpecificEvent
);

router.get("/:id", ReviewController.getSingleReview);

router.post(
  "/",
  auth(UserRole.USER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

router.patch("/:id", auth(UserRole.USER), ReviewController.updateReview);

router.patch(
  "/delete/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
