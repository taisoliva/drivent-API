import { notFoundError } from "@/errors"
import { Ticket, TicketType } from "@/protocols"
import ticketsRepository from "@/repositories/tickets-repository"
import enrollmentsService from "../enrollments-service"

async function getTicketType() {
    const ticketType = await ticketsRepository.getTicketType() 
   return ticketType
}

async function getTicketByUser(userId : number) {
    
    const enrollmentUser = await enrollmentsService.getOneWithAddressByUserId(userId)
    const ticketUser = await ticketsRepository.getTicketByUser(enrollmentUser.id)

    if(!ticketUser ) throw notFoundError()

    const ticketType = await ticketsRepository.getTicketTypeById(ticketUser.ticketTypeId) as TicketType

    const result : Ticket = {
        id:ticketUser.id,
        status:ticketUser.status,
        ticketTypeId:ticketUser.ticketTypeId,
        enrollmentId:ticketUser.enrollmentId,
        TicketType:ticketType,
        createdAt:ticketUser.createdAt,
        updatedAt:ticketUser.updatedAt
    }

    console.log(result)
    return result
}


const ticketsService = {
    getTicketType,
    getTicketByUser
}

export default ticketsService