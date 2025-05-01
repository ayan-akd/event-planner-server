import { Event, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

// Event Save to DB
const eventSaveToDB = async (authInfo: any, payload: Event) => {
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

// Get All Events From DB
const getAllEventsFromToDB = async () => {
  const result = await prisma.event.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

// Get Logged In User Events From DB
const getLoggedInUserEventsFromToDB = async (authInfo: any) => {
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
  });
  return result;
};

// Get Single Event From DB
const getSingleEventsFromToDB = async (eventId: string) => {
  //  Find Event
  const result = await prisma.event.findUniqueOrThrow({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });
  return result;
};

// Hard Delete Single Event From DB
const hardDeleteSingleEventsFromToDB = async (
  eventId: string,
  authInfo: any
) => {
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

export const EventService = {
  eventSaveToDB,
  getAllEventsFromToDB,
  getLoggedInUserEventsFromToDB,
  getSingleEventsFromToDB,
  hardDeleteSingleEventsFromToDB,
};
