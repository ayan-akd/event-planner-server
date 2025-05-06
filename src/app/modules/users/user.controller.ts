import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import pick from "../../../utils/pick";
import { UserFilterableFields } from "./user.constant";
import { TUserFromToken } from "./user.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [...UserFilterableFields, "searchTerm"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await UserService.getAllUsersFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const getUsersForInvitation = catchAsync(
  async (req: Request & {user?: TUserFromToken}, res: Response) => {
    const user = req.user;
    if(!user) {
      throw new Error("User not found");
    }
    const result = await UserService.getUsersForInvitation(user.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUserIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserService.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.changeUserStatus(id, req.body.status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status changed successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  getUsersForInvitation,
  updateUser,
  deleteUser,
  changeUserStatus,
};
