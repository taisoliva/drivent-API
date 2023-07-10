import { AuthenticatedRequest } from "@/middlewares";
import paymentsServices from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export type Card = {
    
	ticketId: number,
	cardData: {
        issuer: string,
        number: number,
        name: string,
        expirationDate: Date,
    cvv: number
    }
}

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

export async function createPayments(req: AuthenticatedRequest, res: Response) {
    
    const payment = req.body as Card
    const {userId} = req

    try{
        const result = await paymentsServices.createPayments(userId, payment)
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