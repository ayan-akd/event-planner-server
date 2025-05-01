import { Event, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

// Event Save to DB
const eventSaveToDB = async (authInfo: any, payload: Event) => {
  // Check User
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
    },
  });
  const result = await prisma.event.create({
    data: { ...payload, organizerId: authInfo.userId },
  });
  return result;
};

// Get All Events From DB
// Event Save to DB
const getAllEventsFromToDB = async () => {
  const result = await prisma.event.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

// Get Logged In User Events From DB
// Event Save to DB
const getLoggedInUserEventsFromToDB = async (authInfo: any) => {
  // Check User Status
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      status: UserStatus.ACTIVE,
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
export const EventService = {
  eventSaveToDB,
  getAllEventsFromToDB,
  getLoggedInUserEventsFromToDB,
};
