// app/api/zoom/create-meeting/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/utils/auth';
import prisma from '@/app/utils/database';
import { getAccessToken } from '@/app/utils/tokenStore';

export async function POST(req: NextRequest) {

  const token = req.headers.get('Authorization')?.split(' ')[1];

  const user = authenticate(token);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { topic, duration, startTime, bookingId } = await req.json();

  console.log(topic, duration, startTime, bookingId);

  const accessToken = await getAccessToken();


  if (!accessToken) {
    console.log('no access token');
    return NextResponse.json({ message: 'Error creating Zoom meeting' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        topic,
        type: 2,
        start_time: startTime,
        duration,
        timezone: 'Africa/Cairo',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: false,
          approval_type: 0,
          registration_type: 1,
        },
      }),
    });

    const data = await response.json();

    console.log('data', data);
    if (data.code) {
      return NextResponse.json({ message: data.message }, { status: 400 });
    }
    return handleMeetingCreation(user, data, duration, topic, bookingId);

    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error creating Zoom meeting' }, { status: 500 });
  }
}

async function handleMeetingCreation(user: any, data: any, duration: number, topic: string, bookingId: number) {
  const { id, start_time } = data;
  const zoomMeetingId = id.toString();
  console.log(zoomMeetingId);

  const meeting = await prisma.meeting.create({
    data: {
      user: { connect: { id: user.userId } },
      meetingId: zoomMeetingId,
      booking: {
        connect: {
          id: Number(bookingId),
          userId: user.userId
        },
      },
      startTime: start_time,
      duration: Number(duration),
      topic: topic,
    },
  });
  // update booking status
  await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: {
      status: 'Meeting Created',
      zoomMeetingId: zoomMeetingId,
    },
  });

  return NextResponse.json({ meeting }, { status: 201 });
}


