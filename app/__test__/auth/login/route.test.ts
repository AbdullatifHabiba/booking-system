/**
 * @jest-environment node
 */
import { POST } from '../../../api/auth/login/route';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../utils/database';


// Mock prisma
jest.mock('../../../utils/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    const requestObj = {
      json: async () => ({
      }),
    }
    const response = await POST(requestObj as any);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Email and password are required' });
  });

  it('should return 400 if user does not exist', async () => {
    const requestObj = {
      json: async () => ({
        email: 'aaa@gmail.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Invalid email or password' });
  });

  it('should return 400 if password is incorrect', async () => {
    const requestObj = {
      json: async () => ({
        email: 'aaa@gmail.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'aaa@gmail.com',
      password: 'hashed-password',
      createdAt: new Date()
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Invalid email or password' });
  });

  it('should return 200 and a token if login is successful', async () => {
    const requestObj = {
      json: async () => ({
        email: 'aaa@gmail.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'aaa@gmail.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

    const response = await POST(requestObj);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ token: 'mocked-token' });
  });
  it('should return 500 if there is an internal server error', async () => {
    const requestObj = {
      json: async () => ({
        email: 'error@example.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Internal server error'));

    const response = await POST(requestObj);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ message: 'Internal Server Error' });
  });



});
