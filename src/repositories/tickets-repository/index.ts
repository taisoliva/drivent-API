import { prisma } from "@/config"
import { TicketType } from "@/protocols"
import { Ticket } from "@prisma/client"

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

async function createTicket(data : Omit <Ticket, "id"> ) {
    return prisma.ticket.create({
       data
    });
}


const ticketsRepository ={
    getTicketType,
    getTicketTypeById,
    getTicketByUser,
    createTicket
}

export default ticketsRepository