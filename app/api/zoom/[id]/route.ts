import { NextResponse } from 'next/server';
import { authenticate } from '../../../../utils/auth';
import prisma from '../../../../utils/database';

export async function DELETE(req: Request, context: any) {
  const body = await req.json();

  const user = authenticate(body.token); // Assuming authenticate function returns user

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;

  try {
    

    // Fetch the Zoom meeting ID
    const meeting = await prisma.meeting.findUnique({
      where: { id: Number(id) },
    });

    if (!meeting) {
      return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }

    // Delete the meeting from Zoom
    const zoomResponse = await fetch(`https://api.zoom.us/v2/meetings/${meeting.meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zoomResponse.ok) {
      console.error('Error deleting Zoom meeting:', await zoomResponse.json());
      return NextResponse.json({ message: 'Failed to delete Zoom meeting' }, { status: 500 });
    }

    // Delete the booking from the database
    await prisma.meeting.delete({
      where: { id: Number(id) },
    });

   
    return NextResponse.json({ message: 'Booking and Zoom meeting deleted' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
  }
}
