import {  NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/utils/auth';
import prisma from '@/utils/database';

// DELETE /bookings/:id
export async function DELETE (req: Request , context:any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  authenticate(token); 

  const { params } = context;
  const { id } = params;

  try {
    const booking = await prisma.booking.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: `Booking deleted ${JSON.stringify(booking)}` ,status:200});

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' ,status:500});
}
}
// GET /bookings/:id
export async function GET(req:NextRequest,context:any) {
    const { params } = context;
    const { id } = params;
  const token = req.headers.get('Authorization')?.split(' ')[1];
  authenticate(token); 
// get booking by id
try {
    const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    });
    return NextResponse.json({ booking ,status:200});

}
catch{
    return NextResponse.json({ message: 'Failed to fetch booking' ,status:500});

}
  
  }
// PATCH /bookings/:id
export async function PUT (req: NextRequest , context:any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  const {slot} = await req.json();

  authenticate(token); // Assuming authenticate function returns user

  const { params } = context;
  const { id } = params;

  try {
    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        slot: { connect: { id: slot } },
      },
    });
    return NextResponse.json({ message: `Booking updated ${JSON.stringify(booking)}` ,status:200});

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' ,status:500});
}
}
