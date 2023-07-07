import { getPayments } from "@/controllers/payments-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router()

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getPayments)
    .post('/payments')

export {paymentsRouter}