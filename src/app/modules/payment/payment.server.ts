import config from "../../../config";
import prisma from "../../../shared/prisma";
import catchAsync from "../../../utils/catchAsync";
import { generateTransactionId } from "../../../utils/generateTransactionId";
import { AppError } from "../../errors/AppError";
import httpStatus from 'http-status';
import SSLCommerz from 'sslcommerz-lts';


const store_id = config.ssl.store_id as string;
const store_passwd = config.ssl.store_pass as string;
const is_live = false; //true for live and false for sandbox

export const initializePayment = catchAsync(async (req, res) => {
  const { userId, eventId } = req.body;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }
  // if organizer of the event is the same user who is trying to pay for the event, this user can not attempt to pay or initiate to pay for the event
  if (
    event.organizerId === user.id &&
    event.organizerId === userId
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are the host/own to this event, you do not need to pay for this event");
  }

 // 🛑 Check for existing successful payment
 const existingPayment = await prisma.payment.findFirst({
  where: {
    userId,
    eventId,
    status: 'SUCCESS',
  },
});

if (existingPayment) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "You have already made a successful payment for this event."
  );
}

  const tran_id = generateTransactionId();

  const data= {
    store_id,
    store_passwd,
    total_amount: event.fee,
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${config.ssl.success_url}/${tran_id}`,
    fail_url: `${config.ssl.fail_url}/${tran_id}`,
    cancel_url: `${config.ssl.cancel_url}/${tran_id}`,
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'N/A',
    product_name: event.title,
    product_category: 'Event',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: 'paymentData.address',
    cus_add2: 'N/A',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01731-000000',
    cus_fax: '01711111111',
    ship_name: 'N/A',
    ship_add1: 'N/A',
    ship_add2: 'N/A',
    ship_city: 'N/A',
    ship_state: 'N/A',
    ship_postcode: 1000,
    ship_country: 'N/A',
};


const sslcz = new SSLCommerz(store_id, store_passwd, is_live);

try {
  const apiResponse = await sslcz.init(data);
  const GatewayPageURL = apiResponse.GatewayPageURL;

  if (!GatewayPageURL) {
    throw new AppError(httpStatus.BAD_GATEWAY, "Failed to generate payment gateway URL.");
  }
  res.send({ gateway_url: GatewayPageURL });
  console.log('Redirecting to: ', GatewayPageURL)
  
  await prisma.payment.create({
    data: {
      userId,
      eventId,
      amount: event.fee,
      transactionId: tran_id,
      status: 'PENDING',
      paymentGatewayData: JSON.parse(JSON.stringify(data)),
    },
  });

} catch (error) {
  console.error("Error initializing SSLCommerz:", error);
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred while processing payment."); 
}

//   const sslResponse = sslcz.init(data).then(apiResponse => {
    // Redirect the user to payment gateway
//     const GatewayPageURL = apiResponse.GatewayPageURL
//     if (!GatewayPageURL) {
//       throw new AppError(httpStatus.BAD_REQUEST, "Failed to get SSLCommerz Gateway URL");
//     }
//     res.send({ gateway_url: GatewayPageURL });
    // console.log('Redirecting to: ', GatewayPageURL)
// });


  // console.log("Payment record created:", result);
});



// Handle the success, fail, and cancel URLs from SSLCommerz

export const paymentSuccess = catchAsync(async (req, res) => {
    // const { tran_id } = req.body;
    const { tran_id } = req.params; // Use req.params to get the tran_id from the URL
  
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
  
    res.redirect(`${config.ssl.success_url}/${tran_id}`);
    console.log("Payment success:", `${config.ssl.success_url}/${tran_id}`);
});
  
export const paymentFail = catchAsync(async (req, res) => {
  // const { tran_id } = req.body;
  const { tran_id } = req.params;

  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: {
      status: 'FAILED',
      paymentGatewayData: req.body,
    },
  });

  res.redirect(`${config.ssl.fail_url}/${tran_id}`);
  console.log("Payment failed:", `${config.ssl.fail_url}/${tran_id}`);
});

export const paymentCancel = catchAsync(async (req, res) => {
  // const { tran_id } = req.body;
  const { tran_id } = req.params;

  await prisma.payment.update({
    where: { transactionId: tran_id },
    data: {
      status: 'CANCELED',
      paymentGatewayData: req.body,
    },
  });

  res.redirect(`${config.ssl.cancel_url}/${tran_id}`);
  console.log("Payment canceled:", `${config.ssl.cancel_url}/${tran_id}`);
});
