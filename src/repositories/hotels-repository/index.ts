import { prisma } from "@/config"


async function getHotels() {
    
    return prisma.hotel.findMany()
}

async function getHotelsById(id:number) {
    return prisma.hotel.findFirst({
        where:{id}
    })
}

async function getHotelWithRooms(id:number) {
    return prisma.hotel.findFirst({
        where:{id},
        include:{Rooms:true}
    })
    
}

const repositoryHotel = {
    getHotels,
    getHotelsById,
    getHotelWithRooms
}

export default repositoryHotel