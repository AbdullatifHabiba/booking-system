/**
 * @jest-environment node
 */

import { DELETE, PUT, GET } from '../../../api/bookings/[id]/route';
import { POST } from '../../../api/bookings/route';
import prisma from '../../../utils/database';
import { NextRequest } from 'next/server';
import { authenticate } from '../../../utils/auth';
import { sendEmailNotification } from '../../../utils/notify';

// Mock prisma
jest.mock('../../../utils/database', () => ({
  __esModule: true,
  default: {
    booking: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock authenticate and sendEmailNotification
jest.mock('../../../utils/auth');
// Mock sendEmailNotification
jest.mock('../../../utils/notify', () => ({
  sendEmailNotification: jest.fn(),
}));
describe('test the bookings id end points', () => {
  describe('DELETE', () => {
    it('should delete a booking when provided with a valid ID and token', async () => {
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

      const mockUser = { email: 'user@example.com' };

      (authenticate as jest.Mock).mockReturnValue(mockUser);
      (prisma.booking.delete as jest.Mock).mockResolvedValue({});
      (sendEmailNotification as jest.Mock).mockResolvedValue({});
      const response = await DELETE(mockRequest, mockContext);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ message: 'Booking deleted' });
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

      (authenticate as jest.Mock).mockImplementation(() => {
        new Error('Authentication token missing');
      });

      const response = await DELETE(mockRequest, mockContext);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    });
  });

  describe('GET', () => {
    it('should return booking data when provided with valid ID and token', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer validToken'),
        },
      } as unknown as NextRequest;

      const mockContext = {
        params: { id: '1' },
      };
      const mockUser = { email: 'user@example.com' };
      const mockTime = '2021-09-01T00:00:00.000Z';

      (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        slotId: 1,
        zoomMeetingId: null,
        status: 'pending',
        createdAt: mockTime,
      });
      (authenticate as jest.Mock).mockReturnValue(mockUser);

      const response = await GET(mockRequest, mockContext);


      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        "booking": {
          id: 1,
          userId: 1,
          slotId: 1,
          zoomMeetingId: null,
          status: 'pending',
          createdAt: mockTime
        }
      }
      );
    });

    it('should return error when authentication token is missing', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;

      const mockContext = {
        params: { id: '1' },
      };

      (authenticate as jest.Mock).mockImplementation(() => {
        new Error('Authentication token missing');
      });

      const response = await GET(mockRequest, mockContext);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    });
  });

  describe('PUT', () => {
    it('should update booking when provided with valid token and data', async () => {
      const mockTime = '2021-09-01T00:00:00.000Z';
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue('Bearer validToken'),
        },
        json: jest.fn().mockResolvedValue({
          id: 1,
          userId: 1,
          slotId: 1,
          zoomMeetingId: '12345',
          status: 'confirmed',
          createdAt: mockTime,
        }),
      } as unknown as NextRequest;

      const mockContext = { params: { id: '1' } };
      const mockUser = { email: 'user@example.com' };

      (authenticate as jest.Mock).mockReturnValue(mockUser);
      (prisma.booking.update as jest.Mock).mockResolvedValue({

        slotId: 1,
        id: 1,
        userId: 1,
        zoomMeetingId: '12345',
        status: 'confirmed',
        createdAt: mockTime,
      });
      (sendEmailNotification as jest.Mock).mockResolvedValue({});

      const response = await PUT(mockRequest, mockContext);

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        message: `Booking updated {"slotId":1,"id":1,"userId":1,"zoomMeetingId":"12345","status":"confirmed","createdAt":"${mockTime}"}`,
      });
    });

    it('should return error when authentication token is missing or invalid', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        json: jest.fn().mockResolvedValue({
          slotId: 1,
          zoomMeetingId: '12345',
          status: 'confirmed',
        }),
      } as unknown as NextRequest;

      const mockContext = { params: { id: '1' } };

      (authenticate as jest.Mock).mockImplementation(() => {
        new Error('Authentication token missing');
      });

      const response = await PUT(mockRequest, mockContext);

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ message: 'Unauthorized' });
    });
  });

});
