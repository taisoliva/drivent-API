import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers"
import supertest from "supertest"
import httpStatus from "http-status"
import faker from "@faker-js/faker"
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createRoom, createRoomFixCapacity, createTicket, createTicketTypeWithHotel, createUser } from "../factories"
import * as jwt from "jsonwebtoken"
import { TicketStatus } from "@prisma/client"

beforeAll(async () => {
    await init()
})

beforeEach(async () => {
    await cleanDb()
})

const server = supertest(app)

describe("GET /booking", () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word()

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 404 when booking is not found", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)

        const response = await server.get("/booking").set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

})

describe("POST /booking", () => {

    it("should respond with 404 when roomId is not found", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)
        const hotel = await createHotel(true)

        const roomId = faker.datatype.number()
       
        const response = await server.post("/booking").set('Authorization', `Bearer ${token}`).send({roomId})
        expect(response.status).toBe(httpStatus.NOT_FOUND)

    })

    it("should respond with 403 when the when the room has no vacancy", async () => {
        const user1 = await createUser()
        const user2 = await createUser()
        const user3 = await createUser()


         const token = await generateValidToken(user1)
         const enrollment1 = await createEnrollmentWithAddress(user1)
         const enrollment2 = await createEnrollmentWithAddress(user2)


         const token2 = await generateValidToken(user2)


        const ticketType = await createTicketTypeWithHotel()
        const ticket1 = await createTicket(enrollment1.id, ticketType.id, TicketStatus.PAID)
        const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID)
        
        await createPayment(ticket1.id, ticketType.price)
        await createPayment(ticket2.id, ticketType.price)

        const hotel = await createHotel(true)
        const room = await createRoomFixCapacity(hotel.id)

        await createBooking(user1.id, room.id)


        const response = await server.post("/booking").set('Authorization', `Bearer ${token2}`).send({roomId: room.id})
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    })

    it("should return 200 when a booking is successful", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)
        const hotel = await createHotel(true)
        const room = await createRoom(hotel.id)

        const response = await server.post("/booking").set('Authorization', `Bearer ${token}`).send({roomId: room.id})
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            bookingId: expect.any(Number)
        })
    })
})

describe("PUT /booking/:bookingId", () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word()

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return 400 when bookingId is invalid', async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)
        const hotel = await createHotel(true)
        const room = await createRoom(hotel.id)
        const booking = await createBooking(user.id, room.id)

        const response = await server.put(`/booking/a`).set('Authorization', `Bearer ${token}`).send({roomId: room.id})
        expect(response.status).toBe(httpStatus.BAD_REQUEST)
    
    })

    it("should respond with 404 when roomId is not found", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)
        const hotel = await createHotel(true)
        const room = await createRoom(hotel.id)

        const roomId = faker.datatype.number()
        const booking = await createBooking(user.id, room.id)
       
        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({roomId})
        expect(response.status).toBe(httpStatus.NOT_FOUND)

    })

    it("should respond with 403 when the when the room has no vacancy", async () => {
        const user1 = await createUser()
        const user2 = await createUser()

        const token = await generateValidToken(user1)
        const enrollment1 = await createEnrollmentWithAddress(user1)
        const enrollment2 = await createEnrollmentWithAddress(user2)

        const token2 = await generateValidToken(user2)

        const ticketType = await createTicketTypeWithHotel()
        const ticket1 = await createTicket(enrollment1.id, ticketType.id, TicketStatus.PAID)
        const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID)
        
        await createPayment(ticket1.id, ticketType.price)
        await createPayment(ticket2.id, ticketType.price)

        const hotel = await createHotel(true)
        const room = await createRoomFixCapacity(hotel.id)

        const booking = await createBooking(user1.id, room.id)


        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token2}`).send({roomId: room.id})
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    })

    it("should return 200 when a update booking is successful", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const payment = await createPayment(ticket.id, ticketType.price)
        
        const hotel = await createHotel(true)
        const hotel2 = await createHotel(true)


        const room = await createRoom(hotel.id)
        const room2 = await createRoom(hotel2.id)

        const booking = await createBooking(user.id, room.id)

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({roomId: room2.id})
        expect(response.status).toBe(httpStatus.OK)
        expect(response.body).toEqual({
            bookingId: expect.any(Number)
        }) 
    })
})
