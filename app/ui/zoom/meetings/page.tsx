'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Meeting {
  id: number;
  bookingId: number;
  topic: string;
  meetingId: string;
  startTime: string;
  duration: number;
}

interface Zoom {
  uuid: string;
  id: number;
  topic: string;
  host_email: string;
  start_time: string;
  duration: number;
  join_url: string;
  start_url: string;
  password: string;
  status: string;
}

const FetchingData = async (): Promise<Meeting[]> => {
  try {
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
      return Array.isArray(data) ? data : [];
    } else {
      console.error('meetings fetch failed:', data);
      return [];
    }
  } catch (error) {
    console.error('meetings fetch error:', error);
    return [];
  }
};

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMeetings = await FetchingData();
      setMeetings(fetchedMeetings);
    };

    fetchData();
  }, []);

  const handleShow = async (id: number) => {
    console.log('Show meeting with ID:', id);
    try {
      const response = await fetch(`/api/zoom/meetings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
        },
      });
      if (!response.ok) {
        console.error('Failed to show meeting:', response.statusText);
        return;
      }

      const data = await response.json();
      setZoom(data.zoom);
    } catch (error) {
      console.error('Show meeting error:', error);
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit meeting with ID:', id);
    router.push(`/ui/zoom/edit-meeting/${id}`);
  };

  const handleDelete = async (id: number) => {
    console.log('Delete meeting with ID:', id);
    try {
      const response = await fetch(`/api/zoom/meetings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
        },
      });

      if (response.ok) {
        setMeetings(meetings.filter(meeting => meeting.id !== id));
      } else {
        console.error('Failed to delete meeting:', response.statusText);
      }
    } catch (error) {
      console.error('Delete meeting error:', error);
    }
  };

  const handleCreateMeeting = () => {
    router.push('/ui/zoom/create-meeting');
  };

  const handleCloseModal = () => {
    setZoom(null);
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl mb-4">Meetings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(meetings) && meetings.length > 0 ? (
          meetings.map(meeting => (
            <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Topic: {meeting.topic}</h3>
              <p><strong>ID:</strong> {meeting.id}</p>
              <p><strong>Booking ID:</strong> {meeting.bookingId}</p>
              <p><strong>Meeting ID:</strong> {meeting.meetingId}</p>
              <p><strong>Start Time:</strong> {new Date(meeting.startTime).toLocaleString()}</p>
              <p><strong>Duration:</strong> {meeting.duration} minutes</p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleShow(meeting.id)}
                >
                  Show
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(meeting.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(meeting.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 col-span-full">No Meetings Available</div>
        )}
      </div>
      <button
        type="button"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCreateMeeting}
      >
        Create Meeting
      </button>

      {zoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">{zoom.topic}</h3>
            <p><strong>ID:</strong> {zoom.id}</p>
            <p><strong>Host Email:</strong> {zoom.host_email}</p>
            <p><strong>Start Time:</strong> {new Date(zoom.start_time).toLocaleString()}</p>
            <p><strong>Duration:</strong> {zoom.duration} minutes</p>
            <p><strong>Status:</strong> {zoom.status}</p>
            <p><strong>Join URL:</strong> <a href={zoom.join_url} target="_blank" className="text-blue-500">Join Meeting</a></p>
            <p><strong>Start URL:</strong> <a href={zoom.start_url} target="_blank" className="text-blue-500">Start Meeting</a></p>
            <p><strong>Password:</strong> {zoom.password}</p>
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
