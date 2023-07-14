import repositoryHotel from "@/repositories/hotels-repository"
import enrollmentsService from "../enrollments-service"
import ticketsService from "../tickets-service";
import { TicketStatus } from "@prisma/client";
import { badRequestError, notFoundError, paymentRequired } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";

async function getHotels(userId : number) {

    const ticket = await ticketsService.getTicketByUser(userId)
    const includesHotel = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId)

    if(ticket.status === TicketStatus.RESERVED || includesHotel.isRemote || !includesHotel.includesHotel ){
        throw paymentRequired()
    }

    const result = await repositoryHotel.getHotels()

    if(result.length === 0) throw notFoundError()
    return result
}

async function getRooms(userId:number, hotelId:string) {
    
    if(isNaN(parseInt(hotelId))){
        throw badRequestError()
    }

    const hotel = await repositoryHotel.getHotelsById(parseInt(hotelId))
    if(!hotel) throw notFoundError()

    await getHotels(userId)

    const hotelById = await repositoryHotel.getHotelWithRooms(parseInt(hotelId))
    return hotelById
}

const hotelService = {
    getHotels,
    getRooms
}

export default hotelService