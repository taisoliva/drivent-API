import { badRequestError, forbiddenError, notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import ticketsService from "../tickets-service"
import ticketsRepository from "@/repositories/tickets-repository"
import { TicketStatus } from "@prisma/client"

async function BusinessRuler(userId: number, roomId: number) {
  const ticket = await ticketsService.getTicketByUser(userId)
  const includesHotel = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId)
  /* const userHasBooking = await bookingRepository.getBookingByUser(userId) */

  if (ticket.status === TicketStatus.RESERVED ||
    includesHotel.isRemote ||
    !includesHotel.includesHotel) {
    return true
  }
}

async function getBooking(userId: number) {

  const result = await bookingRepository.getBookingByUser(userId)

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

  const room = await bookingRepository.getRoom(roomId)
  const howManyBookings = await bookingRepository.getBookingByRoomId(roomId)
  const errorBusinessRule = await BusinessRuler(userId, roomId)

  if (!room || room.capacity === howManyBookings || errorBusinessRule) {

    if (!room) {
      throw notFoundError()
    } else {
      throw forbiddenError()
    }
  }

  const result = await bookingRepository.createBooking(roomId, userId)
  return result.id
}

async function updateBooking(bookingId: string, roomId: number, userId: number) {

  if (isNaN(parseInt(bookingId))) {
    throw badRequestError()
  }

  const result = await bookingRepository.updateBooking(parseInt(bookingId), roomId)
  return result.id

}


const bookingService = {
  getBooking,
  createBooking,
  updateBooking
}

export default bookingService