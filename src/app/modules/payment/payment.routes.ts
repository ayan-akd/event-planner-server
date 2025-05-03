import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/init', PaymentController.initializePayment);
router.post('/success/:tran_id', PaymentController.paymentSuccess);
router.post('/fail/:tran_id', PaymentController.paymentFail);
router.post('/cancel/:tran_id', PaymentController.paymentCancel);

export const PaymentRoutes = router;