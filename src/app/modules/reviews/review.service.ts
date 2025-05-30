import { Review } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { differenceInHours } from "date-fns";

const getAllReviewsFromDB = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      user: true,
      event: true,
    },
  });
  return result;
};

const getAllReviewsForAdminFromDB = async () => {
  const result = await prisma.review.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      event: true,
    },
  });
  return result;
};
//  Get Specific Reviews for a specific event
const getSpecificReviewsForSpecificEventFromDB = async (eventId: string) => {
  const result = await prisma.review.findMany({
    where: {
      eventId,
      isDeleted: false,
    },
    include: {
      user: true,
      event: true,
    },
  });
  return result;
};

const getSingleReviewFromDB = async (id: string) => {
  const result = await prisma.review.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "review not found");
  }
  return result;
};

const createReviewToDB = async (data: Review) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  const isEventExists = await prisma.event.findUnique({
    where: {
      id: data.eventId,
    },
  });
  if (!isEventExists) {
    throw new AppError(httpStatus.NOT_FOUND, "event not found");
  }

  const isUserParticipated = await prisma.participant.findFirst({
    where: {
      userId: data.userId,
      eventId: data.eventId,
      status: "APPROVED",
    },
  });
  if (!isUserParticipated) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you need to participate in the event first"
    );
  }

  const isReviewExists = await prisma.review.findFirst({
    where: {
      userId: data.userId,
      eventId: data.eventId,
    },
  });

  if (isReviewExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you have already reviewed this event"
    );
  }

  const result = await prisma.review.create({
    data,
  });
  return result;
};

const updateReviewToDB = async (id: string, payload: Partial<Review>) => {
  const isExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "review not found");
  }

  const createdAT = new Date(isExist.createdAt);
  const now = new Date();
  const hoursDiff = differenceInHours(now, createdAT);
  if (hoursDiff >= 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't update the review after 1 hour"
    );
  }
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteReviewFromDB = async (id: string) => {
  const isExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "review not found");
  }
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};
export const ReviewService = {
  getAllReviewsFromDB,
  getSingleReviewFromDB,
  createReviewToDB,
  deleteReviewFromDB,
  updateReviewToDB,
  getSpecificReviewsForSpecificEventFromDB,
  getAllReviewsForAdminFromDB,
};
