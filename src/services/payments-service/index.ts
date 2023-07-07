import { badRequestError, notFoundError, unauthorizedError } from "@/errors"
import paymentsRepository from "@/repositories/payments-repository"
import ticketsRepository from "@/repositories/tickets-repository"



async function getPayments(userId: number, ticketId : number | typeof NaN ){
    if(isNaN(ticketId)){
        throw badRequestError()
    }

    const isTicketUser = await ticketsRepository.getTicketByIdWithUser(ticketId, userId)
    const isTicketExisted = await ticketsRepository.getTicketById(ticketId)

    if(!isTicketUser || !isTicketExisted){
        if(!isTicketExisted){
            throw notFoundError()
        } else {
            throw unauthorizedError()
        }
    }
  

    const ticketPayment = await paymentsRepository.getPaymentsbyId(ticketId)
    return ticketPayment
   
}

const paymentsServices = {
    getPayments
}

export default paymentsServices