import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/utils/auth';
import prisma from '@/utils/database';
import { sendEmailNotification } from '@/utils/notify';

// Create a new booking
export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { slotId  } = await req.json();
  try {
    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: user.userId } },
         slot: { connect: { id: slotId } },
      },
    });
     sendEmailNotification(user.email, 'Booking Confirmation', `Your booking has been confirmed for ${slotId}`);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error creating booking',"error":error }, { status: 500 });
  }
}


// Get all bookings for the logged-in user
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.userId },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
  }
}


