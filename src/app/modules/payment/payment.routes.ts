import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/init', PaymentController.initializePayment);
router.post('/success', PaymentController.paymentSuccess);
router.post('/fail', PaymentController.paymentFail);
router.post('/cancel', PaymentController.paymentCancel);

export const PaymentRoutes = router;