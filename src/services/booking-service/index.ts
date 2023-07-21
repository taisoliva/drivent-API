import { badRequestError, forbiddenError, notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import ticketsService from "../tickets-service"
import ticketsRepository from "@/repositories/tickets-repository"
import { TicketStatus } from "@prisma/client"

async function BusinessRulerCreated(userId: number, roomId: number) {
  const ticket = await ticketsService.getTicketByUser(userId)
  const includesHotel = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId)

  if (ticket.status === TicketStatus.RESERVED ||
    includesHotel.isRemote ||
    !includesHotel.includesHotel) {
    return true
  }
}

async function BusinessRulerUpdated(userId: number, roomId: number) {
  const ticket = await ticketsService.getTicketByUser(userId)
  const includesHotel = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId)
  const userHasBooking = await bookingRepository.getBookingByUser(userId) 

  if (ticket.status === TicketStatus.RESERVED ||
    includesHotel.isRemote ||
    !includesHotel.includesHotel || !userHasBooking) {
    return true
  }
}

async function ErrorsCases (userId: number, roomId: number) {
  const room = await bookingRepository.getRoom(roomId)
  const howManyBookings = await bookingRepository.getBookingByRoomId(roomId)
  const errorBusinessRule = await BusinessRulerCreated(userId, roomId)

  if (!room || room.capacity === howManyBookings || errorBusinessRule) {

    if (!room) {
      throw notFoundError()
    } else {
      throw forbiddenError()
    }
  }
}


async function getBooking(userId: number) {

  const result = await bookingRepository.getBookingByUser(userId)

  if(!result){
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

  await ErrorsCases(userId, roomId)

  const result = await bookingRepository.createBooking(roomId, userId)
  return result.id
}

async function updateBooking(bookingId: string, roomId: number, userId: number) {

  if (isNaN(parseInt(bookingId))) {
    throw badRequestError()
  }

  await BusinessRulerUpdated(roomId, userId)
  await ErrorsCases(userId, roomId)

  const result = await bookingRepository.updateBooking(parseInt(bookingId), roomId)
  return result.id

}


const bookingService = {
  getBooking,
  createBooking,
  updateBooking
}

export default bookingService