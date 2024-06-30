// app/api/zoom/create-meeting/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/app/utils/auth';
import prisma from '@/app/utils/database';
import { refreshAccessToken } from '@/app/api/zoom/auth/zoomAuth';
import { getTokens } from '@/app/utils/tokenStore';

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { topic, duration, startTime, bookingId } = await req.json();
  console.log(topic, duration, startTime, bookingId);

  let accessToken = (await getTokens(user.userId))?.accessToken;

  if (!accessToken) {
    accessToken = await refreshAccessToken(user.userId);
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
    if (data.code === 124) {
      // Access token might have expired, refresh it
      accessToken = await refreshAccessToken(user.userId);

      // Retry creating the meeting with the new access token
      const retryResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
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

      const retryData = await retryResponse.json();
      if (retryData.code) {
        return NextResponse.json({ message: retryData.message }, { status: 400 });
      }
      return handleMeetingCreation(user, retryData, duration, topic, bookingId);
    } else if (data.code) {
      return NextResponse.json({ message: data.message }, { status: 400 });
    } else {
      return handleMeetingCreation(user, data, duration, topic, bookingId);
    }
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

  return NextResponse.json(meeting, { status: 201 });
}
