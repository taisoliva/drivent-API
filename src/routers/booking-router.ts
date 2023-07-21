import { createBooking, getBooking, updateBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', createBooking)
    .put('/:bookingId', updateBooking)

export {bookingRouter}