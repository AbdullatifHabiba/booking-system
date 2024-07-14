'use client'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBooking(context:any) {
   const { params } = context;
  const { id } = params;
  const bookingId= id
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    slot: '',
    status: 'Pending',
    zoomMeetingId: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();

  // Fetch booking details if editing
  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
          },
        });
        const data = await response.json();
        
        console.log('Booking Details:', data);

        setBookingDetails({
          date: data.date,
          slot: data.slot,
          status: data.status,
          zoomMeetingId: data.zoomMeetingId,
        });
      };
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    });
  };

  const handleConfirm = async () => {
    // Send booking details to the server
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
      },
      body: JSON.stringify(bookingDetails),
    });

    const data = await response.json();
    console.log('Booking Response:', data);

    if (response.ok) {
      setIsConfirmed(true);
      setShowSuccessMessage(true);
    } else {
      // Handle error
      console.error('Booking update failed:', data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking Details:', bookingDetails);
    setIsSubmitted(true);
  };

  const handleBack = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        router.push('/ui/bookings'); // Change '/success' to the desired route
      }, 3000); // Show success message for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{bookingId ? 'Edit Booking' : 'Create Booking'}</h2>
            <input
              type="datetime-local"
              name="date"
              placeholder="Date"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={bookingDetails.date}
              onChange={handleChange}
            />
            <input
              type="text"
              name="slot"
              placeholder="Slot"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={bookingDetails.slot}
              onChange={handleChange}
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={bookingDetails.status}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zoomMeetingId"
              placeholder="Zoom Meeting ID"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={bookingDetails.zoomMeetingId}
              onChange={handleChange}
            />
            <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}>
              {bookingId ? 'Update Booking' : 'Book'}
            </button>
          </form>
        ) : !showSuccessMessage && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Booking Details</h2>
            <p>Date: {new Date(bookingDetails.date).toLocaleString()}</p>
            <p>Slot: {bookingDetails.slot}</p>
            <p>Status: {bookingDetails.status}</p>
            <p>Zoom Meeting ID: {bookingDetails.zoomMeetingId}</p>
            <button onClick={handleConfirm} style={{ background: '#16a34a', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '1rem' }}>
              Confirm Booking
            </button>
            <button onClick={handleBack} style={{ background: '#dc2626', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '0.5rem' }}>
              Back
            </button>
          </div>
        )}
        {showSuccessMessage && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#16a34a', marginBottom: '1rem' }}>Booking {bookingId ? 'Updated' : 'Confirmed'}!</h2>
            <p>Your booking has been successfully {bookingId ? 'updated' : 'confirmed'}. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}

