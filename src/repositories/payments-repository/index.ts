import { prisma } from "@/config"
import { Payment } from "@prisma/client"

async function getPaymentsbyId(ticketId : number) : Promise<Payment>{
    return prisma.payment.findFirst({
        where :{
            ticketId
        }
    }) 
}

const paymentsRepository = {
    getPaymentsbyId
}

export default paymentsRepository