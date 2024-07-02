'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Function to fetch bookings from API
const fetchBookings = async () => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Assuming data is an array of bookings
    } else {
      console.error('Booking fetch failed:', response.statusText);
      return []; // Return empty array if fetch fails
    }
  } catch (error) {
    console.error('Booking fetch error:', error);
    return []; // Return empty array on error
  }
};

interface Booking {
  id: number;
  slotId: string;
  status: string;
  createdAt: string;
  zoomMeetingId: string | null;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedBookings = await fetchBookings();
      setBookings(fetchedBookings);
    };

    fetchData();
  }, []);

  const handleShow = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleCreateBooking = () => {
    router.push('/ui/bookings/createBook');
  };

  const handleDeleteBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
        },
      });

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== bookingId));
      } else {
        console.error('Failed to delete booking:', response.statusText);
      }
    } catch (error) {
      console.error('Delete booking error:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl mb-4">Bookings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.isArray(bookings) && bookings.length > 0 ? (

        bookings.map(booking => (
          <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">Booking ID: {booking.id}</h3>
            <ul>
              <li className="border-b p-4 bg-gray-100 font-bold">
                Status: {booking.status}
              </li>
              <li className="border-b p-4">
                Slot ID: {booking.slotId}
              </li>
              <li className="border-b p-4">
                Created At: {new Date(booking.createdAt).toLocaleString()}
              </li>
              <li className="border-b p-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleShow(booking)}
                  >
                    Show
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/ui/bookings/editBook/${booking.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          </div>
        ))): (
          <div className="p-4 col-span-full">No Bookings Available</div>
        )
      }
      </div>
      <button
        type="button"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCreateBooking}
      >
        Create Booking
      </button>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Booking Details</h3>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>Slot ID:</strong> {selectedBooking.slotId}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Zoom Meeting ID:</strong> {selectedBooking.zoomMeetingId || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
