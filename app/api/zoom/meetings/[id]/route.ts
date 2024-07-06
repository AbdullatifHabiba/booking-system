import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/utils/auth';
import prisma from '@/app/utils/database';
import { getAccessToken } from '@/app/utils/tokenStore';
export async function DELETE(req: NextRequest, context: any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: Number(id) },
    });

    if (!meeting) {
      return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.log('no access token');
      return NextResponse.json({ message: 'Error deleting Zoom meeting' }, { status: 500 });
    }
    await fetch(`https://api.zoom.us/v2/meetings/${meeting.meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    await prisma.meeting.delete({
      where: { id: Number(id) },
    });
    // update booking status
    await prisma.booking.update({
      where: { id: meeting.bookingId },
      data: { status: 'Meeting Deleted' },
    }); 

    return NextResponse.json({ message: 'Meeting deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting meeting' }, { status: 500 });
  }
}
// get meeting info by id
export async function GET(req: NextRequest, context: any) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: Number(id) },
    });

    if (!meeting) {
      return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }
    console.log('meeting in server', meeting.meetingId);
  // get zoom meeting info
    
  const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('no access token');
      return NextResponse.json({ message: 'Error fetching Zoom meeting' }, { status: 500 });
    }
    console.log('accessToken', accessToken);
  
    
   const response  =  await fetch(`https://api.zoom.us/v2/meetings/${meeting.meetingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

      console.log('data', data);
    return NextResponse.json({meeting:meeting,zoom:data}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error fetching meeting' }, { status: 500 });
  }
}
