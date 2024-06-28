'use client';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect, use } from 'react';

const FetchingData = async () => {

  // Send booking details to the server
  const response = await fetch('/api/bookings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
    },
  });

  const data = await response.json();
  console.log('Bookings Response:', data);

  if (response.ok) {
    console.log(' successful:', data);
    return data as Booking[];
  } else {
    // Handle error
    console.error('Booking failed:', data);
    return [];
  }
};
/**
 * 
 * id	1
userId	1
slotId	1
zoomMeetingId	null
status	"Pending"
createdAt	"2024-06-26T12:15:28.304Z"
 */
interface Booking {
  id: number;
  slotId: string;
  status: string;
  createdAt: string;
  zoomMeetingId: string|null;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      const fetchbookings = await FetchingData();
      setBookings(fetchbookings);
    };

    fetchData();
  }, []);
  // use effect for creating a booking if clicked on the button
const handleCreateBooking = () => { 
  router.push('/ui/bookings/createBook');
}



  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Bookings</h2>
        <ul>
          <li className="border p-4 mb-4">
        id - slotId - status - zoomMeetingId - createdAt
          </li>
          {bookings.map(booking => (
            // define columns
            <li key={booking.id} className="border p-4 mb-4">
             {booking.id} - {booking.slotId} - {booking.status} - {booking.zoomMeetingId} - {booking.createdAt}
            </li>
          ))}
        </ul>
     
        <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }} 
        onClick={handleCreateBooking}
        >
        Create Booking
        </button>
        </div>
    </div>
  );
}
