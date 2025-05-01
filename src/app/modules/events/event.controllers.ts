import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { EventService } from "./event.services";
import { TUserFromToken } from "../users/user.interface";

/**
 * @Description Create Event
 * @Method POST
 * @Params ""
 * @Return Event Data
 */
const createEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.eventSaveToDB(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Created successfully",
      data: result,
    });
  }
);

/**
 * @Description Get Logged In User Events
 * @Method GET
 * @Params ""
 * @Return Event Data
 */
const getLoggedInUserEvents = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.getLoggedInUserEventsFromToDB(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Retrieved successfully",
      data: result,
    });
  }
);

/**
 * @Description Get All Events
 * @Method GET
 * @Params ""
 * @Return Event Data
 */
const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getAllEventsFromToDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event Retrieved successfully",
    data: result,
  });
});

/**
 * @Description Get Single Event
 * @Method GET
 * @Params eventId
 * @Return Event Data
 */
const getSingleEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    const result = await EventService.getSingleEventsFromToDB(eventId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Retrieved successfully",
      data: result,
    });
  }
);

/**
 * @Description Hard Delete Event
 * @Method DELETE
 * @Params eventId
 * @Return Event Data
 */
const hardDeleteEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.hardDeleteSingleEventsFromToDB(
      eventId,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Deleted successfully",
      data: result,
    });
  }
);

/**
 * @Description Soft Delete Event
 * @Method DELETE
 * @Params eventId
 * @Return Event Data
 */
const softDeleteEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.softDeleteSingleEventsFromToDB(
      eventId,
      req.user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Deleted successfully",
      data: result,
    });
  }
);

/**
 * @Description Update Single Event
 * @Method PATCH
 * @Params eventId
 * @Return Event Data
 */
const updateSingleEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.eventUpdate(req.user, eventId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Updated successfully",
      data: result,
    });
  }
);

export const EventController = {
  createEvent,
  getLoggedInUserEvents,
  getAllEvents,
  hardDeleteEvent,
  getSingleEvent,
  softDeleteEvent,
  updateSingleEvent,
};
