import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { func } from "joi";

export function buildBookingInput(){
    return {
        id: faker.datatype.number(),
        Room: {
            id: faker.datatype.number(),
            name: faker.company.companyName(),
            capacity: faker.datatype.number({ min: 1, max: 3 }),
            hotelId: faker.datatype.number() ,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
}

export async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
}