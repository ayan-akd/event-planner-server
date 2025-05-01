import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { InvitationService } from "./invitation.service";

const getAllInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.getAllInvitationsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitations fetched successfully",
    data: result,
  });
});

const getSingleInvitation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvitationService.getSingleInvitationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation fetched successfully",
    data: result,
  });
});

const createInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.createInvitationToDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation created successfully",
    data: result,
  });
});

const updateInvitation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await InvitationService.updateInvitationToDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation updated successfully",
    data: result,
  });
});

const deleteInvitation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await InvitationService.deleteInvitationFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation deleted successfully",
    data: null,
  });
});

export const InvitationController = {
  getAllInvitations,
  getSingleInvitation,
  createInvitation,
  updateInvitation,
  deleteInvitation,
};