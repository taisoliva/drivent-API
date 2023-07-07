import { AuthenticatedRequest } from "@/middlewares";
import paymentsServices from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response){
    
    const {userId} = req
    const ticketId = parseInt(req.query.ticketId as string)


    try{
        const result = await paymentsServices.getPayments(userId, ticketId)
        res.status(httpStatus.OK).send(result)
    }catch(error){
        if(error.name === "BadRequestError"){
            return res.status(httpStatus.BAD_REQUEST).send(error.message)
        } else if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error.message)
        } else if (error.name === "UnauthorizedError") {
            return res.status(httpStatus.UNAUTHORIZED).send(error.message)
        }
    }


}