import { authenticate } from '../utils/auth';
import prisma from '../utils/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.slot.createMany({
      data: [
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-07-07T10:00:00.000Z' },
        { startTime: '2024-07-07T09:00:00.000Z', endTime: '2024-01-01T10:00:00.000Z' },
      ],
    });
    return NextResponse.json({ message: 'Slots created', status: 201 });
  } catch (error) {
    console.error('Error creating slots:', error);
    return NextResponse.json({ message: 'Failed to create slots', status: 500 });
  }
}
