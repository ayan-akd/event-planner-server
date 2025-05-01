import { User, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { Request } from "express";
import { jwtHelpers } from "../../../utils/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const signUp = async (req: Request): Promise<User> => {
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const data = {
    ...req.body,
    password: hashedPassword,
  };
  const result = await prisma.user.create({
    data,
  });
  return result;
};

const logIn = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    },
  });
  if (!isUserExist) {
    throw new Error("User does not exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      userId: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      userId: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMeFromDb = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: {
      email,
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

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userId: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!isUserExist) {
    throw new Error("User does not exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    isUserExist.password
  );
  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  const hashedPassword: string = await bcrypt.hash(newPassword, 12);
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return result;
};

export const AuthService = {
  signUp,
  logIn,
  getMeFromDb,
  changePassword,
  refreshToken,
};
