import { initializePayment, paymentCancel, paymentFail, paymentSuccess } from './payment.server';
export const PaymentController = {
  initializePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};