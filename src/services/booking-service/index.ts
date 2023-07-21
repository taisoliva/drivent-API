import { badRequestError, forbiddenError, notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import ticketsService from "../tickets-service"
import ticketsRepository from "@/repositories/tickets-repository"
import { TicketStatus } from "@prisma/client"

async function BusinessRuler(userId: number) {
  const ticket = await ticketsService.getTicketByUser(userId)
  const includesHotel = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId)

    if(ticket.status === TicketStatus.RESERVED || includesHotel.isRemote || !includesHotel.includesHotel ){
        return true
    }
}

async function getBooking(userId: number) {
    
  const result = await bookingRepository.getBookingByUser(userId)

  return {
    "id":result.id,
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

async function createBooking(roomId: string, userId: number) {

  if(isNaN(parseInt(roomId))){
    throw badRequestError()
  }

  const room = await bookingRepository.getRoom(parseInt(roomId))
  const howManyBookings = await bookingRepository.getBookingByRoomId(parseInt(roomId))
  const errorBusinessRule = await BusinessRuler(userId)

  if(!room || room.capacity === howManyBookings || errorBusinessRule){

    if(!room){
      throw notFoundError()
    } else {
      throw forbiddenError()
    }
  }

  const result = await bookingRepository.createBooking(parseInt(roomId), userId)
  return result.id
}

async function updateBooking() {
  
}


const bookingService = {
    getBooking,
    createBooking,
    updateBooking
}

export default bookingService