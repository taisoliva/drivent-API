import { badRequestError, notFoundError } from "@/errors"
import { TicketType } from "@/protocols"
import ticketsRepository from "@/repositories/tickets-repository"
import enrollmentsService from "../enrollments-service"
import { Ticket, TicketStatus } from "@prisma/client"

async function getTicketType() {
    const ticketType = await ticketsRepository.getTicketType() 
   return ticketType
}

async function getTicketByUser(userId : number) {
    
    const enrollmentUser = await enrollmentsService.getOneWithAddressByUserId(userId)
    const ticketUser = await ticketsRepository.getTicketByUser(enrollmentUser.id)

    if(!ticketUser ) throw notFoundError()

    const ticketType = await ticketsRepository.getTicketTypeById(ticketUser.ticketTypeId) as TicketType

    const result = {
        id:ticketUser.id,
        status:ticketUser.status,
        TicketType:ticketType,
        ticketTypeId:ticketUser.ticketTypeId,
        enrollmentId:ticketUser.enrollmentId,
        createdAt:ticketUser.createdAt,
        updatedAt:ticketUser.updatedAt
    }

    return result
}

async function createTicket(userId : number, ticketTypeId : number) {
    
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId)
    
    if(!ticketTypeId) throw badRequestError()

    const ticketType = await ticketsRepository.getTicketTypeById(ticketTypeId)

    const newTicket : Omit<Ticket, "id"> = {
        enrollmentId:enrollment.id,
        status: TicketStatus.RESERVED,
        ticketTypeId,
        createdAt: new Date(),
        updatedAt: new Date()
    }

   const createdTicket = await ticketsRepository.createTicket(newTicket)

    const ticketInfo  = {
        id:createdTicket.id,
        status:createdTicket.status,
        TicketType:ticketType,
        ticketTypeId:createdTicket.ticketTypeId,
        enrollmentId:createdTicket.enrollmentId,
        createdAt:createdTicket.createdAt,
        updatedAt:createdTicket.updatedAt
    }

    return ticketInfo
}


const ticketsService = {
    getTicketType,
    getTicketByUser,
    createTicket
}

export default ticketsService