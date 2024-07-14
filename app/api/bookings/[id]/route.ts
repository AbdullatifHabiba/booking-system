import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '../../../utils/auth';
import prisma from '../../../utils/database';
import { sendEmailNotification } from '../../../utils/notify';

// DELETE /bookings/:id
// Delete a booking by ID
export async function DELETE(req: NextRequest, context: any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  try {
  const booking=  await prisma.booking.delete({
      where: { id: Number(id) },
    });
    // update slot status
    await prisma.slot.update({
      where: { id: Number(booking.slotId) },   
      data: { status: 'free' },

    });
    sendEmailNotification(user.email, 'Booking Deleted', `Your booking has been deleted with id ${id}`)

      ;
    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting booking' }, { status: 500 });
  }
}
// GET /bookings/:id
export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const { id } = params;
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // get booking by id
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });
    return NextResponse.json({ booking }, { status: 200 });

  }
  catch {
    return NextResponse.json({ message: 'Failed to fetch booking' }, { status: 500 });

  }

}
// PATCH /bookings/:id and set zoomMeetingId
export async function PUT(req: NextRequest, context: any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  const { slot, zoomMeetingId, status } = await req.json();
console.log('slot:', slot, 'zoomMeetingId:', zoomMeetingId, 'status:', status);
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { params } = context;
  const { id } = params;

  try {
    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        slot: { connect: { id:Number(slot)  } },
        zoomMeetingId: zoomMeetingId,
        status: status
      },
    });
    sendEmailNotification(user.email, 'Booking Updated', `Your booking has been confirmed for ${JSON.stringify(booking)}`);

    return NextResponse.json({ message: `Booking updated ${JSON.stringify(booking)}` }, { status: 200 });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
  }
}
