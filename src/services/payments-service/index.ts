import { badRequestError, notFoundError, unauthorizedError } from "@/errors"
import paymentsRepository from "@/repositories/payments-repository"
import ticketsRepository from "@/repositories/tickets-repository"



async function getPayments(userId: number, ticketId : number | typeof NaN ){
    if(isNaN(ticketId)){
        throw badRequestError()
    }

    const isTicketUser = await ticketsRepository.getTicketById(ticketId, userId)
    if(!isTicketUser) throw unauthorizedError()

    const ticketPayment = await paymentsRepository.getPaymentsbyId(ticketId)
    if(!ticketPayment) throw notFoundError()

    

    return ticketPayment
   
}

const paymentsServices = {
    getPayments
}

export default paymentsServices