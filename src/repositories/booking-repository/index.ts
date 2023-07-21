import { prisma } from "@/config"


async function getRoom(id: number) {
    return prisma.room.findFirst({
        where:{id}
    })
}

async function getBookingByUser(userId: number) {
    return prisma.booking.findFirst({
        where: {userId},
        include:{Room : true}
    })
}

async function getBookingByRoomId(roomId: number) {
    return prisma.booking.count({
        where: {roomId}
    })
}

async function createBooking(roomId: number, userId: number) {
    return prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
}

async function updateBooking() {
    
}

const bookingRepository = {
    getRoom,
    getBookingByUser,
    getBookingByRoomId,
    createBooking,
    updateBooking
}

export default bookingRepository