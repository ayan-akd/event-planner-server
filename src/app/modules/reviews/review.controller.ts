import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { TUserFromToken } from "../users/user.interface";

const getAllReviews = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await ReviewService.getAllReviewsFromDB(
      req.user?.userId as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  }
);

const getAllReviewsForAdmin = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await ReviewService.getAllReviewsForAdminFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  }
);

const getAllReviewsForSpecificEvent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.getSpecificReviewsForSpecificEventFromDB(
      req.params.eventId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  }
);

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review fetched successfully",
    data: result,
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReviewToDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.updateReviewToDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ReviewService.deleteReviewFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewController = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsForSpecificEvent,
  getAllReviewsForAdmin,
};
