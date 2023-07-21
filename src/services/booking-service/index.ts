import bookingRepository from "@/repositories/booking-repository"

async function getBooking(userId: number) {
    
  const result = await bookingRepository.getBooking(userId)

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


const bookingService = {
    getBooking
}

export default bookingService