/**
 * @jest-environment node
 */

import { DELETE } from '../../../../api/zoom/meetings/[id]/route';
import prisma from '../../../../utils/database';
import { NextRequest } from 'next/server';
import { authenticate } from '../../../../utils/auth';
import { getTokens } from '../../../../utils/tokenStore';


// Mock prisma
jest.mock('../../../../utils/database', () => ({
    __esModule: true,
    default: {
        meeting: {
            findUnique: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

// Mock authenticate and getTokens
jest.mock('../../../../utils/auth', () => ({
    authenticate: jest.fn(),
}));

jest.mock('../../../../utils/tokenStore', () => ({
    getTokens: jest.fn()
}));

jest.mock('../../../../api/zoom/auth/zoomAuth', () => ({
    refreshAccessToken: jest.fn()
}));

describe('test the DELETE endpoint for deleting meetings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should delete a meeting when provided with a valid token and meeting ID', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
        } as unknown as NextRequest;
        const mockContext = {
            params: {
                id: '1',
            },
        };
        const mockUser = { userId: 1 };
        const mockMeeting = { id: 1, meetingId: 'meeting123' };
        const mockAccessToken = 'mockAccessToken';

        (authenticate as jest.Mock).mockReturnValue(mockUser);
        (prisma.meeting.findUnique as jest.Mock).mockResolvedValue(mockMeeting);
        (getTokens as jest.Mock).mockResolvedValue({ accessToken: mockAccessToken });
        (prisma.meeting.delete as jest.Mock).mockResolvedValue({});

        const response = await DELETE(mockRequest, mockContext);

        expect(response.status).toBe(200);
        expect(authenticate).toHaveBeenCalledWith('validToken');
        expect(prisma.meeting.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(getTokens).toHaveBeenCalledWith(1);
        expect(prisma.meeting.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return 401 when authentication token is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        } as unknown as NextRequest;
        const mockContext = {
            params: {
                id: '1',
            },
        };

        (authenticate as jest.Mock).mockReturnValue(null);

        const response = await DELETE(mockRequest, mockContext);

        expect(response.status).toBe(401);
    });

    it('should return 404 when meeting is not found', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
        } as unknown as NextRequest;
        const mockContext = {
            params: {
                id: '1',
            },
        };

        (authenticate as jest.Mock).mockReturnValue({ userId: 1 });
        (prisma.meeting.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await DELETE(mockRequest, mockContext);

        expect(response.status).toBe(404);
        expect(authenticate).toHaveBeenCalledWith('validToken');
        expect(prisma.meeting.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return 500 when there is an error deleting meeting', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('Bearer validToken'),
            },
        } as unknown as NextRequest;
        const mockContext = {
            params: {
                id: '1',
            },
        };

        (authenticate as jest.Mock).mockReturnValue({ userId: 1 });
        (prisma.meeting.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await DELETE(mockRequest, mockContext);

        expect(response.status).toBe(500);
        expect(authenticate).toHaveBeenCalledWith('validToken');
        expect(prisma.meeting.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

});