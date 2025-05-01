import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { Participant } from "@prisma/client";

const createParticipantIntoDB = async (data: Participant) => {
// console.log(data, "data in participant service");

const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      id: data.userId,
    },
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found");
  }
  const isEventExists = await prisma.event.findUniqueOrThrow({
    where: {
      id: data.eventId,
    },
  });
  if (!isEventExists) {
    throw new AppError(httpStatus.NOT_FOUND, "event not found");
  }

  const isParticipateExists = await prisma.participant.findFirst({
    where: {
      userId: data.userId,
      eventId: data.eventId,
    },
  });

  if (isParticipateExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you have already participated in this event"
    );
  }

  const result = await prisma.participant.create({
    data,
  });
  return result;
};

const getAllParticipantsFromDB = async () => {
  return prisma.participant.findMany({
    where: {
      isDeleted: false,
    },
  });
};

const getSingleParticipantFromDB = async (id: string) => {
  const participant = await prisma.participant.findUnique({
    where: { id,
      isDeleted: false,
     },
  });
  if (!participant)
    throw new AppError(httpStatus.NOT_FOUND, "Participant not found");

  return participant;
};

const updateParticipantIntoDB = async (
  id: string,
  data: Partial<Participant>
) => {
  const isExist = await prisma.participant.findUnique({ where: { id } });
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, "Participant not found");

  const result = prisma.participant.update({ where: { id }, data });
  return result;
};

// hard delete
const hardDeleteParticipantFromDB = async (id: string) => {

  const isExist = await prisma.participant.findUnique({ 
    where: { id } 
  });
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Participant not found");

  const result = await prisma.participant.delete({ 
    where: { id }
  });
  return result;
};


// soft delete
const softDeleteParticipantFromDB = async (id: string) => {
    // Soft delete
  const isExist = await prisma.participant.findUnique({ where: { id } });
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, "Participant not found");

  await prisma.participant.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const ParticipantServices = {
  createParticipantIntoDB,
  getAllParticipantsFromDB,
  getSingleParticipantFromDB,
  updateParticipantIntoDB,
  hardDeleteParticipantFromDB,
  softDeleteParticipantFromDB,
};
