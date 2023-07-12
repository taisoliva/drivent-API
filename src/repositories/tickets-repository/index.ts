import { Ticket } from '@prisma/client';
import { prisma } from '@/config';
import { TicketType } from '@/protocols';

async function getTicketType(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getTicketTypeById(id: number): Promise<TicketType> {
  const ticketType = await prisma.ticketType.findFirst({
    where: { id },
  });

  return ticketType as TicketType;
}

async function getTicketByUser(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
  });
}

async function getTicketByIdWithUser(id: number, userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { id, Enrollment: { userId } },
    include: { Enrollment: true },
  });
}

async function getTicketById(id: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { id },
  });
}

async function createTicket(data: Omit<Ticket, 'id'>) {
  return prisma.ticket.create({
    data,
  });
}

async function updataStatusTicket(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  getTicketType,
  getTicketTypeById,
  getTicketByUser,
  getTicketById,
  getTicketByIdWithUser,
  createTicket,
  updataStatusTicket,
};

export default ticketsRepository;
