import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/utils/auth';
import prisma from '@/utils/database';

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { topic, type, duration, timezone, bookId } = await req.json();
  try {
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        topic,
        type,
        start_time: new Date().toISOString(),
        duration,
        timezone,
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
    if (data.code == 124) {
      return NextResponse.json({ message: data.message }, { status: data.code });
    }
    console.log(data);
    const {  id, start_time } = data;
    const zoomMeetingId = id.toString();
    console.log(zoomMeetingId);
    // Save meeting to database
    const meeting = await prisma.meeting.create({
      data: {
        user: { connect: { id: user.userId } },
        meetingId: zoomMeetingId,
        booking: {
          connect: { id: bookId },
        },
        startTime: start_time,
        duration,
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error creating Zoom meeting' }, { status: 500 });
  }
}
