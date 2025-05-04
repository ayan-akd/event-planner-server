import { Event, Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TUserFromToken } from "../users/user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../utils/paginationHelper";
import { EventSearchAbleFields, EventTypes } from "./event.constant";

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

const getAllEventsFromToDB = async (
  query: any,
  options: IPaginationOptions
) => {
  // All Query Data
  const { searchTerm, eventType, ...filteredData } = query;

  // Pagination Data
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  //  User SearchTerm data
  const andCondition: Prisma.EventWhereInput[] = [];

  // Check Query Data
  if (query?.searchTerm) {
    andCondition.push({
      OR: [
        ...EventSearchAbleFields?.map((field) => ({
          [field]: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        })),
        {
          organizer: {
            name: {
              contains: query?.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Event Type Filtering
  if (eventType) {
    switch (eventType) {
      case EventTypes.FREE_PUBLIC:
        andCondition.push({
          isPublic: true,
          fee: 0,
        });
        break;
      case EventTypes.PAID_PUBLIC:
        andCondition.push({
          isPublic: true,
          fee: {
            gt: 0,
          },
        });
        break;
      case EventTypes.FREE_PRIVATE:
        andCondition.push({
          isPublic: false,
          fee: 0,
        });
        break;
      case EventTypes.PAID_PRIVATE:
        andCondition.push({
          isPublic: false,
          fee: {
            gt: 0,
          },
        });
        break;
      default:
        break;
    }
  }

  // Filter Data
  if (Object.keys(filteredData)?.length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData)?.map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  // Make Object Data  Using ANT Operator
  const whereCondition: Prisma.EventWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // Get User Info
  const result = await prisma.event.findMany({
    // Search User By Name or title
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options?.sortBy && options?.sortOrder
        ? {
            [options?.sortBy]: options?.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      organizer: true,
      invitations: true,
      participants: true,
      reviews: true,
    },
  });

  //  Total Data
  const total = await prisma.event.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    result,
  };
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
      organizer: true,
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
      organizer: true,
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

// Hero Event Select by Admin
const heroSelectByAdmin = async (
  authInfo: TUserFromToken,
  eventId: string,
  payload: { status: boolean }
) => {
  // Check User
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authInfo.userId,
      isDeleted: false,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    },
  });

  // Check Hero Event
  await prisma.event.updateMany({
    where: {
      isHero: true,
    },
    data: {
      isHero: false,
    },
  });
  // Update Hero Event
  const result = await prisma.event.update({
    where: {
      id: eventId,
      isDeleted: false,
    },
    data: {
      isHero: payload.status,
    },
    include: {
      invitations: true,
      participants: true,
      reviews: true,
    },
  });
  return result;
};

// Get Admin Selected Events From DB
const getAdminSelectedEventsFromToDB = async (): Promise<Event | null> => {
  // Check User
  const result = await prisma.event.findFirstOrThrow({
    where: {
      isHero: true,
      isDeleted: false,
    },
    include: {
      organizer: true,
      invitations: true,
      participants: true,
      reviews: true,
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
  heroSelectByAdmin,
  getAdminSelectedEventsFromToDB,
};
