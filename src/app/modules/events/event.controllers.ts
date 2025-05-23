import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import { EventService } from "./event.services";
import { TUserFromToken } from "../users/user.interface";
import pick from "../../../utils/pick";
import {
  EventValidateQueryData,
  LoggedInUserEventValidateQueryData,
} from "./event.constant";

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
    // Select Valid Key and Value
    const filter = pick(req.query, LoggedInUserEventValidateQueryData);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await EventService.getLoggedInUserEventsFromToDB(
      req.user,
      filter,
      options
    );
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
  // Select Valid Key and Value
  const filter = pick(req.query, EventValidateQueryData);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await EventService.getAllEventsFromToDB(filter, options);
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
 * @Description Admin Hard Delete Any Event
 * @Method DELETE
 * @Params eventId
 * @Return Event Data
 */
const adminHardDeleteAnyEvent = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.adminHardDeleteAnySingleEventsFromToDB(
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

/**
 * @Description Update Single Event Hero Status
 * @Method PATCH
 * @Params eventId
 * @Return Event Data
 */
const updateSingleEventHeroStatus = catchAsync(
  async (req: Request & { user?: TUserFromToken }, res: Response) => {
    const { eventId } = req.params;
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await EventService.heroSelectByAdmin(
      req.user,
      eventId,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Hero Selected successfully",
      data: result,
    });
  }
);

/**
 * @Description Get Admin Selected Event
 * @Method GET
 * @Params ""
 * @Return Event Data
 */
const getAdminSelectedHeroEvent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EventService.getAdminSelectedEventsFromToDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Hero Event Retrieved successfully",
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
  updateSingleEventHeroStatus,
  getAdminSelectedHeroEvent,
  adminHardDeleteAnyEvent,
};
