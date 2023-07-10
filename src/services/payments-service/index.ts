import { Card } from "@/controllers"
import { badRequestError, notFoundError, unauthorizedError } from "@/errors"
import paymentsRepository from "@/repositories/payments-repository"
import ticketsRepository from "@/repositories/tickets-repository"
import { Payment } from "@prisma/client"

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

async function createPayments(userId : number, payment: Card) {
   
    if(!payment.ticketId || !payment.cardData){
        throw badRequestError()
    }

    await getPayments(userId, payment.ticketId)

    const isTicketExisted = await ticketsRepository.getTicketById(payment.ticketId)
        
    const ticketType =  await ticketsRepository.getTicketTypeById(isTicketExisted.ticketTypeId)
    const cardLastDigits = payment.cardData.number.toString().slice(-4)

    const newPayment: Omit<Payment, "id"> = {
        ticketId: payment.ticketId,
        value:ticketType.price,
        cardIssuer: payment.cardData.issuer,
        cardLastDigits,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const paymentDone = await paymentsRepository.createPayment(newPayment)
    await ticketsRepository.updataStatusTicket(payment.ticketId)

    return paymentDone

}

const paymentsServices = {
    getPayments,
    createPayments
}

export default paymentsServices