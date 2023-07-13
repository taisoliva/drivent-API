import { prisma } from "@/config"


async function getHotels() {
    
    return prisma.hotel.findMany()
}

const repositoryHotel = {
    getHotels
}

export default repositoryHotel