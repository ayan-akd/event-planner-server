import { Invitation, InvitationStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";

const getAllInvitationsFromDB = async () => {
  const result = await prisma.invitation.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      inviter: true,
      event: true,
      user: true,
    }
  });
  return result;
};

const getPendingMyCreatedInvites = async (userId: string) => {
  const result = await prisma.invitation.findMany({
    where: {
      inviterId: userId,
      status: InvitationStatus.PENDING,
      isDeleted: false,
    },
    include: {
      inviter: true,
      event: true,
      user: true,
    }
  });
  return result;
};

const getPendingMyReceivedInvites = async (userId: string) => {
  const result = await prisma.invitation.findMany({
    where: {
      participantId: userId,
      status: InvitationStatus.PENDING,
      isDeleted: false,
    },
    include: {
      inviter: true,
      event: true,
      user: true,
    }
  });
  return result;
};

const getSingleInvitationFromDB = async (id: string) => {
  const result = await prisma.invitation.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      inviter: true,
      event: true,
      user: true,
    }
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
  if (payload.status === InvitationStatus.ACCEPTED) {
    await prisma.$transaction(async (tx) => {
      //update invitation status to accepted
      const invitation = await tx.invitation.update({
        where: {
          id,
        },
        data: {
          status: InvitationStatus.ACCEPTED,
        },
      });
      //create a participant
      const participant = await tx.participant.create({
        data: {
          eventId: isInvitationExists.eventId,
          userId: isInvitationExists.participantId,
          inviteId: isInvitationExists.id,
        },
      });
      return {
        invitation,
        participant,
      };
    });
  }
  if (payload.status === InvitationStatus.REJECTED) {
    const result = await prisma.invitation.update({
      where: {
        id,
      },
      data: {
        status: InvitationStatus.REJECTED,
        hasRead: true,
      },
    });
    return result;
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
  getPendingMyCreatedInvites,
  getPendingMyReceivedInvites,
  getSingleInvitationFromDB,
  createInvitationToDB,
  updateInvitationToDB,
  deleteInvitationFromDB,
};
