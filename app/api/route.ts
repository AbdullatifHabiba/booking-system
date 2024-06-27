import prisma  from '../utils/database';
import { NextResponse } from 'next/server';
export async function GET() {
  try{
  await prisma.slot.createMany({
    data: [
      { startTime: new Date('2024-07-01T09:00:00Z'), endTime: new Date('2024-07-01T10:00:00Z') },
      { startTime: new Date('2024-07-01T10:00:00Z'), endTime: new Date('2024-07-01T11:00:00Z') },
      { startTime: new Date('2024-07-01T11:00:00Z'), endTime: new Date('2024-07-01T12:00:00Z') },
      { startTime: new Date('2024-07-01T12:00:00Z'), endTime: new Date('2024-07-01T13:00:00Z') },
      { startTime: new Date('2024-07-01T13:00:00Z'), endTime: new Date('2024-07-01T14:00:00Z') },
      { startTime: new Date('2024-07-01T14:00:00Z'), endTime: new Date('2024-07-01T15:00:00Z') },

    ],
  });
  return NextResponse.json({ message: 'Slots created' ,status:201});
}
catch(error){
  console.error('Error creating slots:', error);
  return NextResponse.json({ message: 'Failed to create slots' ,status:500});
}

}

