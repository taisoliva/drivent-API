import { AuthenticatedRequest } from "@/middlewares";
import { Request, Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";


export async function createTicket(req: AuthenticatedRequest, res:Response){

}

export async function getTicketType(req: Request, res: Response){
    try{
        const result = await ticketsService.getTicketType()
        res.status(httpStatus.OK).send(result)
    }catch(error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({"message":"Algo não está certo"})
    }

}

export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
    const {userId} = req

    try{
        const result = await ticketsService.getTicketByUser(userId)
        res.status(httpStatus.OK).send(result)
    } catch(error){
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
          }
    }
}