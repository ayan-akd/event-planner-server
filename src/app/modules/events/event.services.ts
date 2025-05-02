import { Event, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TUserFromToken } from "../users/user.interface";

// Event Save to DB
const eventSaveToDB = async (
  authInfo: TUserFromToken,
  payload: Event
): Promise<Event | null> => {
  // Check User
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });
  const result = await prisma.event.create({
    data: { ...payload, organizerId: authInfo.userId },
  });
  return result;
};

// Event Update
const eventUpdate = async (
  authInfo: TUserFromToken,
  eventId: string,
  payload: Partial<Event>
): Promise<Event | null> => {
  // Check Event
  await prisma.event.findUniqueOrThrow({
    where: {
      organizerId: authInfo.userId,
      id: eventId,
      isDeleted: false,
    },
  });
  // Update Event
  const result = await prisma.event.update({
    where: {
      organizerId: authInfo.userId,
      id: eventId,
      isDeleted: false,
    },
    data: payload,
  });
  return result;
};

// Get All Events From DB
const getAllEventsFromToDB = async (): Promise<Event[] | []> => {
  const result = await prisma.event.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      invitations: true,
      participants: true,
      reviews: true,
    },
  });
  return result;
};

const getLoggedInUserEventsFromToDB = async (
  authInfo: TUserFromToken
): Promise<Event[] | []> => {
  // Check User Status
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  });
  //  Find User
  const result = await prisma.event.findMany({
    where: {
      organizerId: authInfo.userId,
      isDeleted: false,
    },
    include: {
      invitations: true,
      participants: true,
      reviews: true,
    },
  });
  return result;
};

// Get Single Event From DB
const getSingleEventsFromToDB = async (
  eventId: string
): Promise<Event | null> => {
  //  Find Event
  const result = await prisma.event.findUniqueOrThrow({
    where: {
      id: eventId,
      isDeleted: false,
    },
    include: {
      invitations: true,
      participants: true,
      reviews: true,
    },
  });
  return result;
};

// Hard Delete Single Event From DB
const hardDeleteSingleEventsFromToDB = async (
  eventId: string,
  authInfo: TUserFromToken
): Promise<Event | null> => {
  // check User
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });
  //  Check  Event
  await prisma.event.findUniqueOrThrow({
    where: {
      id: eventId,
      organizerId: authInfo.userId,
      isDeleted: false,
    },
  });

  // Delete Event
  const result = await prisma.event.delete({
    where: {
      id: eventId,
      organizerId: authInfo.userId,
    },
  });
  return result;
};

// Soft Delete Single Event From DB
const softDeleteSingleEventsFromToDB = async (
  eventId: string,
  authInfo: TUserFromToken
): Promise<Event | null> => {
  // check User
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });
  //  Check  Event
  await prisma.event.findUniqueOrThrow({
    where: {
      id: eventId,
      organizerId: authInfo.userId,
      isDeleted: false,
    },
  });

  // Delete Event
  const result = await prisma.event.update({
    where: {
      id: eventId,
      organizerId: authInfo.userId,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const EventService = {
  eventSaveToDB,
  getAllEventsFromToDB,
  getLoggedInUserEventsFromToDB,
  getSingleEventsFromToDB,
  hardDeleteSingleEventsFromToDB,
  softDeleteSingleEventsFromToDB,
  eventUpdate,
};
