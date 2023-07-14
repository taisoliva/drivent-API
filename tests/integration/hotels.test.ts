import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken"
import supertest from 'supertest';
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createHotel, createPayment, createRoom, createTicket, createTicketType, createTicketTypeNotHotel, createTicketTypeWithHotel, createUser, generateCreditCardData } from "../factories";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/config";

beforeAll(async () => {
  await init()
})

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app)

describe("GET /hotels", () => {

  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word()

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when enrollment doesnt exists", async ()=>{
      const user = await createUser()
      const token = await generateValidToken(user);

      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 404 when ticket doesnt exists", async ()=>{
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 404 when hotels doesnt exists", async ()=>{
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const payment = await createPayment(ticket.id, ticketType.price)

      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.NOT_FOUND)
    })

    it("should respond with status 402 when payment doesnt confirm", async ()=>{
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
      

      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 402 when is remote or dont include hotel", async ()=>{
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketTypeNotHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      
      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 200 and All Hotels", async () => {
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketTypeWithHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const payment = await createPayment(ticket.id, ticketType.price)

       await createHotel(ticketType.includesHotel)
       await createHotel(ticketType.includesHotel)
     
      const response = await server.get("/hotels").set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.OK)
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          })
        ])
      )

      /* expect(response.body).toEqual(
       expect.objectContaining({
         id : expect.any(Number),
         name : hotel.name,
         image: hotel.image,
         createdAt: expect.any(String),
         updatedAt: expect.any(String),
         Rooms: expect.arrayContaining([
           expect.objectContaining({
             id: room.id,
             name: room.name,
             capacity: room.capacity,
             hotelId: room.hotelId,
             createdAt: expect.any(String),
             updatedAt: expect.any(String),
           })
         ])
       })
      ) */

    })
  })

  describe("GET /hotels/:hotelId", ()=>{

    it("should respond with 400 when hotelId is invalid", async() =>{
      const user = await createUser()
      const token = await generateValidToken(user)
      
      const response = await server.get("/hotels/a").set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.BAD_REQUEST)

    })

    it("should respond with 404 when hotelId dont exists", async() =>{
      const user = await createUser()
      const token = await generateValidToken(user)
      
      const response = await server.get("/hotels/1").set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.NOT_FOUND)

    })

    it("should respond with status 402 when payment doesnt confirm", async ()=>{
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketType()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)
      const hotel = await createHotel(ticketType.includesHotel)
      

      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 402 when is remote or dont include hotel", async ()=>{
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketTypeNotHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const hotel = await createHotel(ticketType.includesHotel)
      
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
    })

    it("should respond with status 200 and Hotel with rooms data", async () => {
      const user = await createUser()
      const token = await generateValidToken(user)
      const enrollment = await createEnrollmentWithAddress(user)
      const ticketType = await createTicketTypeWithHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const payment = await createPayment(ticket.id, ticketType.price)

       const hotel = await createHotel(ticketType.includesHotel)
       await createRoom(hotel.id)
       await createRoom(hotel.id)
       await createRoom(hotel.id)

      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(httpStatus.OK)
      expect(response.body).toEqual(
       expect.objectContaining({
         id : expect.any(Number),
         name : hotel.name,
         image: hotel.image,
         createdAt: expect.any(String),
         updatedAt: expect.any(String),
         Rooms: expect.arrayContaining([
           expect.objectContaining({
             id: expect.any(Number),
             name: expect.any(String),
             capacity: expect.any(Number),
             hotelId: hotel.id,
             createdAt: expect.any(String),
             updatedAt: expect.any(String),
           })
         ])
       })
      ) 

    })
  })
  

})

