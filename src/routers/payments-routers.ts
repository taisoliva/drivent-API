import { Router } from 'express';
import { createPayments, getPayments } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPayments).post('/process', createPayments);

export { paymentsRouter };
