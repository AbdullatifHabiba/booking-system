import Link from 'next/link';

const bookings = [
  { id: 1, slot: '10:00 AM - 11:00 AM', status: 'Confirmed' },
  { id: 2, slot: '11:00 AM - 12:00 PM', status: 'Pending' },
  // Add more bookings as needed
];

export default function Bookings() {
  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Bookings</h2>
        <ul>
          {bookings.map(booking => (
            <li key={booking.id} className="border p-4 mb-4">
              {booking.slot} - {booking.status}
            </li>
          ))}
        </ul>
     
        <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}>
        <Link href="/ui/bookings/createBook">Create Booking</Link>
        </button>
        </div>
    </div>
  );
}
