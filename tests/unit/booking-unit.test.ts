import bookingRepository from "@/repositories/booking-repository";
import { buildTicketInputIncludesHotel, buildTicketInputRemote, buildTicketInputReserved, buildUserInput } from "../factories";
import bookingService from "@/services/booking-service";
import { buildBookingInput } from "../factories/booking-factory";
import ticketsService from "@/services/tickets-service";

describe("Booking Service Unit Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it("should return a booking by User", async () => {

        jest.mock("bcrypt", () => {
            return {
                hash: () => { return "valor simulado no mock" }
            }
        })

        const mockUser = buildUserInput()
        const mockResult = buildBookingInput()

        jest.spyOn(bookingRepository, "getBookingByUser").mockImplementationOnce((): any => {
            return mockResult
        })

        const booking = await bookingService.getBooking(mockUser.id)
        expect(booking).toEqual(mockResult)
    })

    it("should return a forbidden Error if ticket dont Paid", async () => {
        const mockTicket = buildTicketInputReserved()

        jest.spyOn(ticketsService, "getTicketByUser").mockResolvedValueOnce(mockTicket)
        const promise = bookingService.createBooking(1, 1)
        expect(promise).rejects.toEqual({
            name: "ForbiddenError",
            message: "you dont have permission"
        })
    })

    it("should return a forbidden Error if ticket is remote", async () => {
        const mockTicket = buildTicketInputRemote()

        jest.spyOn(ticketsService, "getTicketByUser").mockResolvedValueOnce(mockTicket)
        await expect(bookingService.createBooking(1, 1)).rejects.toEqual({
            name: "ForbiddenError",
            message: "you dont have permission",
          });
    })

    it("should return a forbidden Error if ticket dont have hotel", async () => {
        const mockTicket = buildTicketInputIncludesHotel()

        jest.spyOn(ticketsService, "getTicketByUser").mockResolvedValueOnce(mockTicket)
        await expect(bookingService.createBooking(1, 1)).rejects.toEqual({
            name: "ForbiddenError",
            message: "you dont have permission",
          });
    })

    it("should return a forbidden Error if user doesnt have a booking", async () => {
        jest.spyOn(bookingRepository, "getBookingByUser").mockImplementationOnce((): any => {
            return undefined
        })
        await expect(bookingService.updateBooking("1",1,1)).rejects.toEqual({
            name: "ForbiddenError",
            message: "you dont have permission",
          });
    })


}) 