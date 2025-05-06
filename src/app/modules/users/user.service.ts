import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { Prisma, User, UserStatus } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../utils/paginationHelper";
import { UserSearchableFields } from "./user.constant";

const getAllUsersFromDB = async (query: any, options: IPaginationOptions) => {
  const { searchTerm, ...filteredData } = query;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: UserSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: filteredData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
    where: {
      ...whereCondition,
      isDeleted: false,
    },
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
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
      events: true,
      reviews: true,
      receivedInvitations: true,
      payments: true,
    },
  });
  const total = await prisma.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    result,
  };
};

const getUsersForInvitation = async (userId: string) => {
  const result = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      isDeleted: false,
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
    },
  });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  return result;
};

const updateUserIntoDB = async (id: string, data: Partial<User>) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      isDeleted: true,
    },
    data,
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  }); 
  return result;
};

const changeUserStatus = async (id: string, status: UserStatus) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getUsersForInvitation,
  updateUserIntoDB,
  deleteUserFromDB,
  changeUserStatus,
};
