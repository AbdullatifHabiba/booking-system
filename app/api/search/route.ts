import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/database';

export async function GET(req: NextRequest) {
  const { search, startTime, endTime } = await req.json();

  const filters: any = {};

  if (search) {
    filters.OR = [
      { startTime: { contains: search, mode: 'insensitive' } },
      { endTime: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (startTime) {
    filters.startTime = {
      gte: new Date(startTime),
    };
  }

  if (endTime) {
    filters.endTime = {
      lte: new Date(endTime),
    };
  }

  try {
    const slots = await prisma.slot.findMany({
      where: filters,
    });

    return NextResponse.json(slots, { status: 200 });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ message: 'Failed to fetch slots' }, { status: 500 });
  }
}
