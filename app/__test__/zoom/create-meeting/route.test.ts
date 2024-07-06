/**
 * @jest-environment node
 */
import prisma from "../../../utils/database";
import { authenticate } from "../../../utils/auth";
import { NextRequest } from "next/server";
import { POST } from "../../../api/zoom/create-meeting/route";
import { getAccessToken } from "../../../utils/tokenStore";

jest.mock('../../../utils/database', () => ({
    __esModule: true,
    default: {
        meeting: {
            findUnique: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        },
        booking: {
            update: jest.fn(),
        },

    },
}));
jest.mock('../../../utils/auth', () => ({
    authenticate: jest.fn(),
}));

jest.mock('../../../utils/tokenStore', () => ({
    getAccessToken: jest.fn()
}));



describe('create meeting', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST', () => {

        // Successfully authenticates user with valid token
        it('should create a Zoom meeting when user is authenticated with a valid token', async () => {
            const mockToken = 'valid.jwt.token';
            const mockUser = { userId: 1 };
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${mockToken}`),
                },
                json: jest.fn().mockResolvedValue({
                    topic: 'Test Meeting',
                    duration: 30,
                    startTime: '2023-10-10T10:00:00Z',
                    bookingId: 123,
                }),
            };
            const mockResponse = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };


            global.fetch = jest.fn().mockResolvedValue({
                json: jest.fn().mockResolvedValue({ id: 'meetingId', start_time: '2023-10-10T10:00:00Z' }),
            });
            // mock prisma
            (prisma.meeting.create as jest.Mock).mockResolvedValue({ id: 'meetingId', start_time: '2023-10-10T10:00:00Z' });
            (prisma.booking.update as jest.Mock).mockResolvedValue({ id: 123, status: 'Meeting Created' });
            (authenticate as jest.Mock).mockReturnValue(mockUser);
            (getAccessToken as jest.Mock).mockResolvedValue('newAccessToken');

            const response = await POST(mockRequest as unknown as NextRequest);

            expect(mockRequest.headers.get).toHaveBeenCalledWith('Authorization');
            expect(response.status).toBe(201);
        });

        // Missing Authorization header in request
        it('should return 401 Unauthorized when Authorization header is missing', async () => {
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
                json: jest.fn().mockResolvedValue({
                    topic: 'Test Meeting',
                    duration: 30,
                    startTime: '2023-10-10T10:00:00Z',
                    bookingId: 123,
                }),
            };

            (authenticate as jest.Mock).mockImplementation(() => {
                new Error('Authentication token missing');
            }
            );
            const response = await POST(mockRequest as unknown as NextRequest);

            expect(mockRequest.headers.get).toHaveBeenCalledWith('Authorization');
            expect(response.status).toBe(401);
        });
    });



});