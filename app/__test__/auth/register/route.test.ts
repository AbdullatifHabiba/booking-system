/**
 * @jest-environment node
 */
import { POST } from '../../../api/auth/register/route'; // Adjust the import path as necessary
import bcrypt from 'bcryptjs';
import prisma from '../../../utils/database';

// Mock prisma
jest.mock('../../../utils/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    const requestObj = {
      json: async () => ({}),
    } as any;

    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Email and password are required' });
  });

  it('should return 400 if email is invalid', async () => {
    const requestObj = {
      json: async () => ({
        email: 'invalid-email',
        password: 'password123',
      }),
    } as any;

    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Invalid email' });
  });

  it('should return 400 if password is less than 6 characters', async () => {
    const requestObj = {
      json: async () => ({
        email: 'valid@example.com',
        password: '123',
      }),
    } as any;

    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'Password must be at least 6 characters' });
  });

  it('should return 400 if user already exists', async () => {
    const requestObj = {
      json: async () => ({
        email: 'exists@example.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'exists@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const response = await POST(requestObj);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ message: 'User already exists' });
  });

  it('should return 201 and create a new user if registration is successful', async () => {
    const requestObj = {
      json: async () => ({
        email: 'newuser@example.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(
      "hashed-password");
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'newuser@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const response = await POST(requestObj);

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      user: {
        id: 1,
        email: 'newuser@example.com',
        password: 'hashed-password',
        createdAt: expect.any(String),
      },
    });
  });
  it('should return 201 and create a new user if registration is successful', async () => {
    const requestObj = {
      json: async () => ({
        email: 'newuser@example.com',
        password: 'password123',
      }),
    } as any;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'newuser@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
    });

    const response = await POST(requestObj);

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      user: {
        id: 1,
        email: 'newuser@example.com',
        password: 'hashed-password',
        createdAt: expect.any(String),
      },
    });
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
