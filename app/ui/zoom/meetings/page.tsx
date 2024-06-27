import Link from 'next/link';

const meetings = [
  { id: 1, topic: 'Meeting 1', startTime: '10:00 AM', duration: '1 hour' },
  { id: 2, topic: 'Meeting 2', startTime: '11:00 AM', duration: '1 hour' },
  // Add more meetings as needed
];

export default function Meetings() {
  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Meetings</h2>
        <ul>
          {meetings.map(meeting => (
            <li key={meeting.id} className="border p-4 mb-4">
              {meeting.topic} - {meeting.startTime} - {meeting.duration}
            </li>
          ))}
        </ul>
     
        <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}>
        <Link href="/ui/zoom/create-meeting">Create Meeting</Link>
        </button>
        </div>
    </div>
  );
}
