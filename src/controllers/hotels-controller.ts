import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {

   const {userId} = req

    try {
        const result = await hotelService.getHotels(userId)
        return res.status(httpStatus.OK).send(result)
    } catch (error) {
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        } else if (error.name === "PaymentRequired"){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }
    }

}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
    
    const {userId} = req
    const {hotelId} = req.params

    try {
        const result = await hotelService.getRooms(userId, hotelId)
        return res.status(httpStatus.OK).send(result)
    } catch (error) {
        if(error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        } else if (error.name === "PaymentRequired"){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        } else if (error.name === "BadRequestError") {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
    }
}