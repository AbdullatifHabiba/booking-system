import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../../utils/auth';
import prisma from '../../../../utils/database';

export async function POST(req: NextRequest) {
 // console.log(req);

  const body =  req.json();
  const { slot } = await body;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  const user = authenticate(token); // Assuming authenticate function returns user


  try {
    const booking = await prisma.meeting.create({
      data: {
        user: { connect: { id: user.userId } },
         slot: { connect: { id: slot } },
      },
    });
    return NextResponse.json({ message: `Booking created AS ${JSON.stringify(booking)}` ,status:201});

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Failed to create booking' ,status:500});
}
}

export async function GET(req: NextRequest) {

  console.log(req.headers);
  const authorization = req.headers.get('Authorization')?.split(' ')[1];

  const user = authenticate(authorization); // Assuming authenticate function returns user

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.userId },
    });

return NextResponse.json({ bookings ,status:200});
  } catch (error) {
    console.error('Error fetching bookings:', error);
return NextResponse.json({ message: 'Failed to fetch bookings' ,status:500});
  }
}




