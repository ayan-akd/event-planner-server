/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from "shurjopay";
import config from "../../../config";
const shurjopay = new Shurjopay();

shurjopay.config(
  config.SP_ENDPOINT!,
  config.SP_USERNAME!,
  config.SP_PASSWORD!,
  config.SP_PREFIX!,
  config.SP_RETURN_URL!
);

// Make Payment
const makePaymentAsync = async (
  orderPayload: any
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      orderPayload,
      (res) => resolve(res),
      (err) => reject(err)
    );
  });
};

// Payment Verify
const verifyPaymentAsync = (
  order_id: string
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (res) => resolve(res),
      (err) => reject(err)
    );
  });
};

export const PaymentUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
