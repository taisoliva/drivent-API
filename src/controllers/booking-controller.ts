import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    
    const {userId} = req

    try {
        const result = await bookingService.getBooking(userId)
        return res.status(httpStatus.OK).send(result)
    } catch (error) {
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        } 
    }
}

export async function createBooking (req: AuthenticatedRequest, res: Response){

    const {roomId} = req.body
    const {userId} = req

    try {
        const result = await bookingService.createBooking(roomId, userId)
        return res.status(httpStatus.OK).send(result)
        
    } catch (error) {
        if(error.name === "BadRequestError"){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        } else if (error.name === "ForbiddenError"){
            return res.sendStatus(httpStatus.FORBIDDEN)
        } else if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response){

    const {bookingId} = req.params
    const {roomId} = req.body
    const {userId} = req

    try {
        const result = await bookingService.updateBooking(bookingId, roomId, userId)
        res.status(httpStatus.OK).send(result)
        
    } catch (error) {
        if(error.name === "BadRequestError"){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        } else if (error.name === "ForbiddenError"){
            return res.sendStatus(httpStatus.FORBIDDEN)
        } else if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
    }
}