import { badRequestError, forbiddenError, notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import ticketsService from "../tickets-service"
import ticketsRepository from "@/repositories/tickets-repository"
import { TicketStatus } from "@prisma/client"

async function BusinessRuleCreated(userId: number) {
  const ticket = await ticketsService.getTicketByUser(userId)
  if(ticket.status === TicketStatus.RESERVED){
    throw forbiddenError()
  } else if (ticket.TicketType.isRemote){
    throw forbiddenError()
  } else if (!ticket.TicketType.includesHotel){
    throw forbiddenError()
  }
 
}


async function ErrorsCases(userId: number, roomId: number) {
  const room = await bookingRepository.getRoom(roomId)
  const howManyBookings = await bookingRepository.getBookingByRoomId(roomId)

  if (!room) {
    throw notFoundError()
  }

  if (room.capacity === howManyBookings) {
    throw forbiddenError()
  }
}


async function getBooking(userId: number) {

  const result = await bookingRepository.getBookingByUser(userId)

  if (!result) {
    throw notFoundError()
  }

  return {
    "id": result.id,
    "Room": {
      "id": result.Room.id,
      "name": result.Room.name,
      "capacity": result.Room.capacity,
      "hotelId": result.Room.hotelId,
      "createdAt": result.Room.createdAt,
      "updatedAt": result.Room.updatedAt
    }
  }

}

async function createBooking(roomId: number, userId: number) {

  await BusinessRuleCreated(userId)
  await ErrorsCases(userId, roomId)

  const result = await bookingRepository.createBooking(roomId, userId)
  return result.id
}

async function updateBooking(bookingId: string, roomId: number, userId: number) {

  if (isNaN(parseInt(bookingId))) {
    throw badRequestError()
  }

  await ErrorsCases(userId, roomId)

  const result = await bookingRepository.updateBooking(parseInt(bookingId), roomId)

  if(!result){
    throw forbiddenError()
  } 
  return result.id

}


const bookingService = {
  getBooking,
  createBooking,
  updateBooking
}

export default bookingService