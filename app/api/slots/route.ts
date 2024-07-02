import { NextResponse } from 'next/server';
import prisma from '../../utils/database';
import { authenticate } from '../../utils/auth';


export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
      orderBy: {
        startTime: 'desc',
      },
     
    });
    return NextResponse.json(slots, { status: 200 });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ message: 'Failed to fetch slots' }, { status: 500 });
  }
}
// POST /slots as array  by admin auth
export async function POST(req: Request) {
  //authorize admin
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (user.email !== process.env.EMAIL_USER) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  console.log(data);

  try {
    await prisma.slot.createMany({
      data: data,
    });
    return NextResponse.json({ message: 'Slots created', status: 201 });
  } catch (error) {
    console.error('Error creating slots:', error);
    return NextResponse.json({ message: 'Failed to create slots', status: 500 });
  }
}
// Delete all slots by admin
export async function DELETE(req: Request) {
  //authorize admin
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const user = authenticate(token);
  if (user.email !== process.env.EMAIL_USER) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.slot.deleteMany();
  } catch (error) {
    console.error('Error deleting slots:', error);
    return NextResponse.json({ message: 'Failed to delete slots', status: 500 });
  }
}