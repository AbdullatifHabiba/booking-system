
/**
 * @jest-environment node
 */

import { GET } from '../../../api/zoom/meetings/route';
import prisma from '../../../utils/database';
import { NextRequest } from 'next/server';
import { authenticate } from '../../../utils/auth';

 // Mock prisma
 jest.mock('../../../utils/database', () => ({
    __esModule: true,
    default: {
        meeting: {
            findUnique: jest.fn(),
            findMany: jest.fn(),

        },
    },
}));

// Mock authenticate
jest.mock('../../../utils/auth', () => ({
    authenticate: jest.fn(),
}));

describe('test the GET function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
   
    describe('test the meetings/[id] endpoint', () => {
        it('should return the meeting when provided with a valid id and token', async () => {
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('Bearer validToken'),
                },
                params: {
                    id: 'meetingId',
                },
            } as unknown as NextRequest;

            const mockUser = { userId: 'userId' };
            const mockMeeting = { id: 'meetingId', userId: 'userId', topic: 'Meeting Title' };

            (authenticate as jest.Mock).mockReturnValue(mockUser);
            (prisma.meeting.findMany as jest.Mock).mockResolvedValue(mockMeeting);

            const response = await GET(mockRequest);

            expect(response.status).toBe(200);
        });

        it('should return 401 when authentication token is missing', async () => {
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
                params: {
                    id: 'meetingId',
                },
            } as unknown as NextRequest;

            (authenticate as jest.Mock).mockImplementation(() => {
                 new Error('Authentication token missing');
            });

            const response = await GET(mockRequest);

            expect(response.status).toBe(401);
        });

        it('should return 500 when there is an error fetching the meeting', async () => {
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('Bearer validToken'),
                },
                params: {
                    id: 'meetingId',
                },
            } as unknown as NextRequest;

            const mockUser = { userId: 'userId' };

            (authenticate as jest.Mock).mockReturnValue(mockUser);
            (prisma.meeting.findMany as jest.Mock).mockRejectedValue(new Error('Error fetching meeting'));

            const response = await GET(mockRequest);

            expect(response.status).toBe(500);
        });
    }); it('should return all meetings for the logged-in user', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
        } as unknown as NextRequest;
        const mockUser = { userId: 1 };
        const mockMeetings = [{ id: 1, userId: 1, title: 'Meeting 1' }, { id: 2, userId: 1, title: 'Meeting 2' }];
        (authenticate as jest.Mock).mockReturnValue(mockUser);
        (prisma.meeting.findMany as jest.Mock).mockResolvedValue(mockMeetings);
        const response = await GET(mockRequest);
        expect(response.status).toBe(200);
    });

    it('should return 401 when authentication token is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        } as unknown as NextRequest;
        (authenticate as jest.Mock).mockReturnValue(null);
        const response = await GET(mockRequest);
        expect(response.status).toBe(401);
    });

    it('should return 500 when there is an error fetching meetings', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
        } as unknown as NextRequest;
        const mockUser = { userId: 1 };
        (authenticate as jest.Mock).mockReturnValue(mockUser);
        (prisma.meeting.findMany as jest.Mock).mockRejectedValue(new Error('Error fetching meetings'));
        const response = await GET(mockRequest);
        expect(response.status).toBe(500);
    });
});