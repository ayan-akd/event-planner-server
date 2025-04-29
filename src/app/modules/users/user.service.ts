
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { Request } from "express";
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt'

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  return result;
};

const createUserIntoDB = async (req: Request): Promise<User> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12)
  const data = {
    ...req.body,
    password: hashedPassword
  }
  const result = await prisma.user.create({
    data,
  });
  return result;
};

const updateUserIntoDB = async (id: string, data: any) => {
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

  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  createUserIntoDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
