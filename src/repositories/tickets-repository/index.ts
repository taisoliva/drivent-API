import { prisma } from "@/config"
import { Ticket, TicketType } from "@/protocols"

async function getTicketType(): Promise<TicketType[]> {
    return prisma.ticketType.findMany()
}

async function  getTicketTypeById(id : number): Promise<TicketType> {
    const ticketType = await prisma.ticketType.findFirst({
        where : {id}
    })

    return ticketType as TicketType
}


async function getTicketByUser(enrollmentId : number) { 
    return prisma.ticket.findFirst({
        where : {
            enrollmentId
        }
    })
    
}


const ticketsRepository ={
    getTicketType,
    getTicketTypeById,
    getTicketByUser
}

export default ticketsRepository