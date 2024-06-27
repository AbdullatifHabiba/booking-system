'use client'; 
import React, { useState } from 'react';
import MeetingCard from '../../components/MeetingCard';

interface Meeting {
  id: number;
  meetingId: string;
  startTime: string;
  duration: number;
}

const CreateMeeting: React.FC = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    topic: '',
    startTime: '',
    duration: 0,
  });

  const [meeting, setMeeting] = useState<Meeting | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeetingDetails({
      ...meetingDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
       console.log(meetingDetails);
    // Call Zoom API to create a meeting
    const response = await fetch('/api/zoom/create-meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
      },
      body: JSON.stringify(meetingDetails),
    });

    const data = await response.json();
    setMeeting(data.meeting);
  };

  const handleBack = () => {
    setMeeting(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!meeting ? (
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create Meeting</h2>
            <input
              type="text"
              name="topic"
              placeholder="Meeting Topic"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={meetingDetails.topic}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="startTime"
              placeholder="Start Time"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={meetingDetails.startTime}
              onChange={handleChange}
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={meetingDetails.duration}
              onChange={handleChange}
            />
            <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}>
              Create Meeting
            </button>
          </form>
        ) : (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <MeetingCard meeting={meeting} />
            <button onClick={handleBack} style={{ background: '#dc2626', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '0.5rem' }}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeeting;
