import { Hotel } from "@prisma/client";
import { Room } from "@prisma/client";
import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel(includesHotel : boolean) {
    return prisma.hotel.create({
        data:{
            name: faker.company.companyName(),
            image: faker.image.city()
        }
    })
}

export async function createRoom(hotelId: number) {
    return prisma.room.create({
        data:{
            name: faker.datatype.number({ min: 100, max: 999 }).toString(),
            capacity: faker.datatype.number({ min: 1, max: 3 }),
            hotelId
        }
    })
}

export async function createRoomFixCapacity(hotelId: number) {
    return prisma.room.create({
        data:{
            name: faker.datatype.number({ min: 100, max: 999 }).toString(),
            capacity: 1,
            hotelId
        }
    })
}



export function buildRoomInput() {
    return {
        id: faker.datatype.number(),
        name: faker.datatype.number({ min: 100, max: 999 }).toString(),
        capacity: faker.datatype.number({ min: 1, max: 3 }),
        hotelId: faker.datatype.number(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
}