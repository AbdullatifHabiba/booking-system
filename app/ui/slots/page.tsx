import Navbar from '../components/Navbar';

const slots = [
  { id: 1, startTime: '10:00 AM', endTime: '11:00 AM' },
  { id: 2, startTime: '11:00 AM', endTime: '12:00 PM' },
  // Add more slots as needed
];

export default function Slots() {
  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Available Slots</h2>
        <ul>
          {slots.map(slot => (
            <li key={slot.id} className="border p-4 mb-4">
              {slot.startTime} - {slot.endTime}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
