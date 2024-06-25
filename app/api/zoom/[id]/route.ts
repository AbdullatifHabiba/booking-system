import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/utils/auth';
import prisma from '@/utils/database';

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

    await fetch(`https://api.zoom.us/v2/meetings/${meeting.meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    await prisma.meeting.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Meeting deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting meeting' }, { status: 500 });
  }
}
