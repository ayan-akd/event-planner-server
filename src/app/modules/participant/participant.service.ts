import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { Participant } from "@prisma/client";
import { PaymentUtils } from "./participant.utils";

const createParticipantIntoDB = async (
  data: Participant,
  client_ip: string | undefined
) => {
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

  if (isEventExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event has been deleted");
  }

  // Auto approve if event isPublic is true && fee is 0 using ternary operator
  const { isPublic, fee } = isEventExists;

  const status = isPublic && fee === 0 ? "APPROVED" : "PENDING";

  //  Check Status and Fee
  if (fee === 0) {
    // Create participant with status "APPROVED"
    const result = await prisma.participant.create({
      data: {
        ...data,
        status: status,
      },
    });
    return {
      isPremium: false,
      result,
    };
  }

  // Payment Payload
  const orderPayload = {
    amount: Math.ceil(isEventExists.fee),
    order_id: isUserExists.id,
    currency: "BDT",
    customer_name: isUserExists.name,
    customer_address: "NA",
    customer_email: isUserExists?.email,
    customer_phone: "NA",
    customer_city: "NA",
    client_ip,
  };

  //  Make Payment
  const paymentResponse = await PaymentUtils.makePaymentAsync(orderPayload);
  if (paymentResponse?.transactionStatus) {
    await prisma.payment.create({
      data: {
        userId: isUserExists?.id,
        amount: Math.ceil(isEventExists.fee),
        eventId: isEventExists?.id,
        status: "PENDING",
        transactionId: paymentResponse?.sp_order_id,
      },
    });
  }
  // Failed Success
  return {
    isPremium: true,
    checkout_url: paymentResponse?.checkout_url,
  };
};

//  Verify Payment
const verifyPayment = async (orderId: string, userId: string) => {
  const verifiedPayment = await PaymentUtils.verifyPaymentAsync(orderId);
  // Update Payment Status
  if (
    verifiedPayment?.length &&
    verifiedPayment[0]?.bank_status === "Success"
  ) {
    const updatedPayment = await prisma.payment.update({
      where: {
        transactionId: orderId,
        userId: userId,
        status: "PENDING",
      },
      data: {
        status: "SUCCESS",
      },
    });

    // Create participant with status "PENDING"
    await prisma.participant.create({
      data: {
        userId: updatedPayment?.userId,
        eventId: updatedPayment?.eventId,
        status: "PENDING",
        hasPaid: true,
      },
    });
  }

  return verifiedPayment;
};

const getAllParticipantsFromDB = async () => {
  return prisma.participant.findMany({
    where: {
      isDeleted: false,
    },
  });
};

// Get All Participants for Logged In User
const getParticipantsForLoggedInUser = async (userId: string) => {
  return prisma.participant.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      event: true,
      user: true,
    },
  });
};

const getSingleParticipantFromDB = async (id: string) => {
  const participant = await prisma.participant.findUnique({
    where: { id, isDeleted: false },
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
    where: { id },
  });
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, "Participant not found");

  const result = await prisma.participant.delete({
    where: { id },
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
  verifyPayment,
  getParticipantsForLoggedInUser,
};
