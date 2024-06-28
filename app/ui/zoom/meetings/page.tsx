
'use client';
import { useRouter } from 'next/navigation';

import React, { useState, useEffect } from 'react';

const FetchingData = async () => {

  // Send booking details to the server
  const response = await fetch('/api/zoom/meetings', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
    },
  });

  const data = await response.json();
  console.log('meetings Response:', data);

  if (response.ok) {
    console.log(' successful:', data);
    return data as Meeting[];
  } else {
    // Handle error
    console.error('Booking failed:', data);
    return [];
  }
};
interface Meeting {
  id: number;
  topic: string;
  meetingId: string;
  startTime: string;
  duration: number;

}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      const fetchedMeetings = await FetchingData();
      setMeetings(fetchedMeetings);
    };

    fetchData();
  }, []);
  const handleCreateMeeting = () => {
    router.push('/ui/zoom/create-meeting');
  }
  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Meetings</h2>
        <ul>
          {meetings.map(meeting => (
            <li key={meeting.id} className="border p-4 mb-4">
              {meeting.topic} - {meeting.meetingId} - {meeting.startTime} - {meeting.duration}
            </li>
          ))}
        </ul>
     
        <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}
        onClick={handleCreateMeeting}
        >
          Create Meeting
        </button>
        </div>
    </div>
  );
}
