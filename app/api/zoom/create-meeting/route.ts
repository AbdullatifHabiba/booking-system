import { authenticate } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/database';

// Define the structure of the Zoom response
interface ZoomMeetingResponse {
  id: string;
  start_time: string;
  [key: string]: any; // To allow any other properties
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, type, duration, timezone } = body;
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authorization token is missing', status: 401 });
  }

  const user = authenticate(token); // Assuming authenticate function returns user object

  if (!user) {
    return NextResponse.json({ message: 'Invalid or expired token', status: 401 });
  }

  let zoomData: ZoomMeetingResponse;

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating Zoom meeting:', errorData);
      return NextResponse.json({ message: 'Failed to create Zoom meeting', status: 500 });
    }

    zoomData = await response.json();
    console.log("Successfully created Zoom meeting", zoomData);

  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    return NextResponse.json({ message: 'Failed to create Zoom meeting', status: 500 });
  }

  const { start_time, id } = zoomData;

  try {
    const meeting = await prisma.meeting.create({
      data: {
        duration: duration,
        startTime: new Date(start_time),
        user: { connect: { id: user.userId } },
        meetingId: id.toString(),
      },
    });

    return NextResponse.json({ message: `Meeting created successfully`, meeting }, { status: 201 });

  } catch (error) {
    console.error('Error saving meeting to database:', error);
    return NextResponse.json({ message: 'Failed to save meeting to database', status: 500 });
  }
}
