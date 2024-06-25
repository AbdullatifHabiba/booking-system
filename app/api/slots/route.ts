import { NextResponse } from 'next/server';
import prisma from '../../../utils/database';

export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(slots, { status: 200 });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ message: 'Failed to fetch slots' }, { status: 500 });
  }
}
