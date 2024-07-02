/**
 * @jest-environment node
 */

import { POST } from '../../api/bookings/route';
import prisma from '../../utils/database';
import { NextRequest } from 'next/server';
import { authenticate } from '../../utils/auth';
import { sendEmailNotification } from '../../utils/notify';

// Mock prisma
jest.mock('../../utils/database', () => ({
    __esModule: true,
    default: {
        booking: {
            findUnique: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        },
        slot: {
            update: jest.fn(),
        },
    },
}));

// Mock authenticate and sendEmailNotification
jest.mock('../../utils/auth');
// Mock sendEmailNotification
jest.mock('../../utils/notify', () => ({
    sendEmailNotification: jest.fn(),
}));
describe('test the bookings id end points', () => {

    it('should create a booking when provided with valid token and slot', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken')
            },
            json: jest.fn().mockResolvedValue({ slot: 1 })
        } as unknown as NextRequest;

        const mockUser = { email: 'test@example.com' };
        const mockBooking = { id: 1, userId: 1, slotId: 1, status: 'Pending' };

        (authenticate as jest.Mock).mockReturnValue(mockUser);
        (prisma.booking.create as jest.Mock).mockResolvedValue(mockBooking);
        (prisma.slot.update as jest.Mock).mockResolvedValue({});
        (sendEmailNotification as jest.Mock).mockResolvedValue({});

        const response = await POST(mockRequest);
        expect(response.status).toBe(201);


    });
    it('should return 401 when authentication token is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        } as unknown as NextRequest;
        (authenticate as jest.Mock).mockImplementation(() => {
            new Error('Authentication token missing');
        });


        const response = await POST(mockRequest);
        expect(response.status).toBe(401);


    });
    it('should return 500 when there is an error creating booking', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
            json: jest.fn().mockResolvedValue({ slot: 1 }),
        } as unknown as NextRequest;

        const mockUser = { email: 'test@example.com' };

        (authenticate as jest.Mock).mockReturnValue(mockUser);
        (prisma.booking.create as jest.Mock).mockRejectedValue(new Error('Error creating booking'));
        (sendEmailNotification as jest.Mock).mockResolvedValue({});

        const response = await POST(mockRequest);
        expect(response.status).toBe(500);
    });
});
