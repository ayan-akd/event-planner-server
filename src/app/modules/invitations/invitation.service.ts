import { Invitation } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllInvitationsFromDB = async () => {
  const result = await prisma.invitation.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const getSingleInvitationFromDB = async (id: string) => {
  const result = await prisma.invitation.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "invitation not found");
  }
  return result;
};

const createInvitationToDB = async (data: Invitation) => {
  const isParticipantExists = await prisma.user.findUnique({
    where: {
      id: data.participantId,
    },
  });
  if (!isParticipantExists) {
    throw new AppError(httpStatus.NOT_FOUND, "participant not found");
  }

  const isInviterExists = await prisma.user.findUnique({
    where: {
      id: data.inviterId,
    },
  });
  if (!isInviterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "inviter not found");
  }

  const isEventExists = await prisma.event.findUnique({
    where: {
      id: data.eventId,
    },
  });
  if (!isEventExists) {
    throw new AppError(httpStatus.NOT_FOUND, "event not found");
  }

  const isInvitationExists = await prisma.invitation.findFirst({
    where: {
      participantId: data.participantId,
      eventId: data.eventId,
    },
  });
  if (isInvitationExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you have already invited this user"
    );
  }

  const result = await prisma.invitation.create({
    data,
  });
  return result;
};

const updateInvitationToDB = async (
  id: string,
  payload: Partial<Invitation>
) => {
  const isInvitationExists = await prisma.invitation.findUnique({
    where: {
      id,
    },
  });
  if (!isInvitationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "invitation not found");
  }
  const result = await prisma.invitation.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteInvitationFromDB = async (id: string) => {
  const isInvitationExists = await prisma.invitation.findUnique({
    where: {
      id,
    },
  });
  if (!isInvitationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "invitation not found");
  }
  const result = await prisma.invitation.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const InvitationService = {
  getAllInvitationsFromDB,
  getSingleInvitationFromDB,
  createInvitationToDB,
  updateInvitationToDB,
  deleteInvitationFromDB,
};
