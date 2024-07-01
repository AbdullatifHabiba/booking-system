import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/utils/auth';
import prisma from '@/app/utils/database';
// get all meetings for the logged-in user
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: user.userId },
    });

    return NextResponse.json({meetings}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching meetings' }, { status: 500 });
  }
}

