import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { ParticipantServices } from "./participant.service";


const createParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipantServices.createParticipantIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Participant created successfully",
    data: result,
  });
});

const getAllParticipants = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipantServices.getAllParticipantsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participants fetched successfully",
    data: result,
  });
});

const getSingleParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParticipantServices.getSingleParticipantFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant fetched successfully",
    data: result,
  });
});

const updateParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParticipantServices.updateParticipantIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant updated successfully",
    data: result,
  });
});

const deleteParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ParticipantServices.deleteParticipantFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant deleted successfully",
    data: null,
  });
});

export const ParticipantControllers = {
    createParticipant,
  getAllParticipants,
  getSingleParticipant,
  updateParticipant,
  deleteParticipant,
};
