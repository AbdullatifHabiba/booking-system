import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../utils/auth';
import prisma from '../../../../utils/database';

// Get all meetings per user
export async function GET(req: NextRequest) {
  console.log(req.headers);
  const authorization = req.headers.get('Authorization')?.split(' ')[1];

  if (!authorization) {
    return NextResponse.json({ message: 'Authorization token is missing' }, { status: 401 });
  }

  const user = authenticate(authorization); // Assuming authenticate function returns user

  if (!user) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: user.userId },
    });

    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ message: 'Failed to fetch meetings' }, { status: 500 });
  }
}
