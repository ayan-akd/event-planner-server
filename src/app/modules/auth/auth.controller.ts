import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";
import { TUserFromToken } from "../users/user.interface";

const signUpController = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUp(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const logInController = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.logIn(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
    },
  });
});

const getMeController = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user) {
      throw new Error("User is required");
    }
    const { email } = req.user;
    console.log(email);
    const result = await AuthService.getMeFromDb(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  }
);

const refreshTokenController = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token generated successfully!",
        data: result
    })
});




const changePasswordController = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user?.userId) {
      throw new Error('User ID is required');
    }
    const result = await AuthService.changePassword(
      req.user.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  });

export const AuthController = {
  signUpController,
  logInController,
  getMeController,
  changePasswordController,
  refreshTokenController,
};
