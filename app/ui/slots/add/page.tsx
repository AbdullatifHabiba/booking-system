'use client';
import {useRouter} from 'next/navigation';
import React, { useEffect, useState } from 'react';

function AddSlotForm() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const router = useRouter();

  const handleConfirm = async () => {
    try {
      // Format start and end time to ISO 8601 format
      const startTimeISO = new Date(startTime).toISOString();
      const endTimeISO = new Date(endTime).toISOString();

      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')}`,
        },
        body: JSON.stringify({ startTime: startTimeISO, endTime: endTimeISO, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to add slot');
      }

      console.log('Slot added successfully');
      setIsConfirmed(true); 
      setShowSuccessMessage(true);

    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startTime') {
      setStartTime(value);
    } else if (name === 'endTime') {
      setEndTime(value);
    } else if (name === 'status') {
      setStatus(value);
    }
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
};

  const handleBack = () => {
    setShowSuccessMessage(false);
    setIsConfirmed(false);
    setStartTime('');
    setEndTime('');
    setStatus('');
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        router.push('/ui/slots'); // Change '/success' to the desired route
      }, 3000); // Show success message for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage, router]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Add Slot</h2>
            <input
              type="datetime-local"
              name="startTime"
              placeholder="Enter start time"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={startTime}
              onChange={handleChange}
              required
            />
            <input
              type="datetime-local"
              name="endTime"
              placeholder="Enter end time"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={endTime}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="status"
              placeholder="Enter status"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '0.25rem' }}
              value={status}
              onChange={handleChange}
              required
            />
            <button type="submit" style={{ background: '#1d4ed8', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem' }}>
              Book
            </button>
          </form>
        ) : !showSuccessMessage && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Booking Details</h2>
            <p>Start Time: {new Date(startTime).toLocaleString()}</p>
            <p>End Time: {new Date(endTime).toLocaleString()}</p>
            <p>Status: {status}</p>
            <button onClick={handleConfirm} style={{ background: '#16a34a', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '1rem' }}>
              Confirm Adding
            </button>
            <button onClick={handleBack} style={{ background: '#dc2626', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '0.25rem', marginTop: '0.5rem' }}>
              Back
            </button>
          </div>
        )}
        {showSuccessMessage && (
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#16a34a', marginBottom: '1rem' }}>Adding Confirmed!</h2>
            <p>Your Adding has been successfully confirmed. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddSlotForm;
