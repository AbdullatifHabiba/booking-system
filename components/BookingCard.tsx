import React from 'react';

interface Booking {
  id: number;
  date: string;
  slot: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div>
      <h3>Booking ID: {booking.id}</h3>
      <p>Date: {booking.date}</p>
      <p>Slot: {booking.slot}</p>
    </div>
  );
};

export default BookingCard;
