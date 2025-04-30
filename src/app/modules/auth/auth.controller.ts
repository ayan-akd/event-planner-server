import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../../config";

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

export const AuthController = {
  signUpController,
  logInController,
};
