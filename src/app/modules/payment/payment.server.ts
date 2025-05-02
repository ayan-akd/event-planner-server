import config from "../../../config";
import prisma from "../../../shared/prisma";
import catchAsync from "../../../utils/catchAsync";
import { generateTransactionId } from "../../../utils/generateTransactionId";
import { initSSLCommerz } from "../ssl/util";
import { AppError } from "../../errors/AppError";
import httpStatus from 'http-status';
import { SSLPaymentInitData } from "../ssl/ssl.interface";

export const initializePayment = catchAsync(async (req, res) => {
  const { userId, eventId } = req.body;
//   clg
  console.log(userId, eventId);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });

  const transactionId = generateTransactionId();

  await prisma.payment.create({
    data: {
      userId,
      eventId,
      amount: event.fee,
      transactionId,
      status: 'PENDING',
    },
  });

  const sslcz = initSSLCommerz();
  const data: SSLPaymentInitData = {
    total_amount: event.fee,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.ssl.successUrl}`,
    fail_url: `${config.ssl.failUrl}`,
    cancel_url: `${config.ssl.cancelUrl}`,
    ipn_url: `${config.ssl.sslIpnUrl}`,
    cus_name: user.name,
    cus_email: user.email,
    // cus_phone: user.phone,
    product_name: event.title,
    product_category: 'event',
    product_profile: 'general',
  };
//   clg
  console.log(data);

  const sslResponse = await sslcz.init(data);
  res.send({ gateway_url: sslResponse.GatewayPageURL });
});

export const paymentSuccess = catchAsync(async (req, res) => {
    const { tran_id } = req.body;
  
    const payment = await prisma.payment.findFirst({ where: { transactionId: tran_id } });
    if (!payment) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment not found with this transaction id"
      );
    }
  
    await prisma.payment.update({
      where: { transactionId: tran_id },
      data: {
        status: 'SUCCESS',
        paymentGatewayData: req.body,
      },
    });
  
    // Update the participant record for the paid user and event
    await prisma.participant.updateMany({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
      data: {
        hasPaid: true,
      },
    });
  
    res.redirect(`/payment-success?tran_id=${tran_id}`);
  });
  

export const paymentFail = catchAsync(async (req, res) => {
  const { tran_id } = req.body;

  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: {
      status: 'FAILED',
      paymentGatewayData: req.body,
    },
  });

  res.redirect(`/payment-fail?tran_id=${tran_id}`);
});

export const paymentCancel = catchAsync(async (req, res) => {
  const { tran_id } = req.body;

  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: {
      status: 'CANCELED',
      paymentGatewayData: req.body,
    },
  });

  res.redirect(`/payment-cancel?tran_id=${tran_id}`);
});
