import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { ParticipantServices } from "./participant.service";
import { TUserFromToken } from "../users/user.interface";

const createParticipant = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body)
  const result = await ParticipantServices.createParticipantIntoDB(
    req.body,
    req.ip
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Participant created successfully",
    data: result,
  });
});

/**
 * @description  Verify Payment
 * @param ''
 * @Query "orderId"
 * @returns  Data
 */
const ParticipantPaymentVerify = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const result = await ParticipantServices.verifyPayment(
      req.query.order_id as string,
      req.user?.userId as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment Verify Successful",
      data: result,
    });
  }
);

const getAllParticipants = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipantServices.getAllParticipantsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participants fetched successfully",
    data: result,
  });
});

// Get All Participants for Logged In User
const getParticipantsForLoggedInUser = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const result = await ParticipantServices.getParticipantsForLoggedInUser(
      req.user?.userId as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Participants fetched successfully",
      data: result,
    });
  }
);

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
  const result = await ParticipantServices.updateParticipantIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant updated successfully",
    data: result,
  });
});

// hard delete
const deleteParticipant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParticipantServices.hardDeleteParticipantFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Participant deleted successfully",
    data: result,
  });
});

// soft delete
const deleteWithUpdateParticipant = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await ParticipantServices.softDeleteParticipantFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Participant deleted successfully",
      data: null,
    });
  }
);

export const ParticipantControllers = {
  createParticipant,
  getAllParticipants,
  getSingleParticipant,
  updateParticipant,
  deleteParticipant,
  deleteWithUpdateParticipant,
  ParticipantPaymentVerify,
  getParticipantsForLoggedInUser,
};
