import { prisma } from "@/config"
import { Payment } from "@prisma/client"

async function getPaymentsbyId(ticketId : number) : Promise<Payment>{
    return prisma.payment.findFirst({
        where :{
            ticketId
        }
    }) 
}

async function createPayment(data : Omit<Payment, "id">) {
    return prisma.payment.create({
        data
    })
}

const paymentsRepository = {
    getPaymentsbyId,
    createPayment
}

export default paymentsRepository