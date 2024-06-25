import {  NextResponse } from 'next/server';
import { authenticate } from '../../../../utils/auth';
import prisma from '../../../../utils/database';

export async function DELETE (req: Request , context:any) {
  const body = await req.json();

  const user = authenticate(body); // Assuming authenticate function returns user

  const { id } = context.params;

  try {
    const booking = await prisma.booking.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: `Booking deleted` ,status:200});

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' ,status:500});
}
}
