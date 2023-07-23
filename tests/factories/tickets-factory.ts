import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeNotHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: false,
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function builTicketType(isRemote: boolean, includesHotel: boolean){
  return{
      id: faker.datatype.number(),
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
      createdAt: new Date(),
      updatedAt: new Date()
  }
}

export function buildTicketInputRemote () {
    return {
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    TicketType : builTicketType(true, false),
    enrollmentId: faker.datatype.number(),
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date()
    }
}


export function buildTicketInputReserved(){
  return{
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    TicketType : builTicketType(false, true),
    enrollmentId: faker.datatype.number(),
    status: TicketStatus.RESERVED,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function buildTicketInputIncludesHotel(){
  return{
    id: faker.datatype.number(),
    ticketTypeId: faker.datatype.number(),
    TicketType : builTicketType(false, false),
    enrollmentId: faker.datatype.number(),
    status: TicketStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}