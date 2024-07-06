'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  status: string; // New status field
}

async function fetchSlots(): Promise<Slot[]> {
  try {
    const response = await fetch('/api/slots', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching slots: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Slot[];
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
}

function Slots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSlots = await fetchSlots();
      setSlots(fetchedSlots);
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSlots = slots.filter(slot =>
    slot.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.endTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl mb-4">Available Slots</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 mb-4 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length > 0 ? (
          filteredSlots.map(slot => (
            <div key={slot.id} className="bg-white rounded-lg shadow-md p-4">
             <p className="text-lg font-bold">ID: { slot.id}</p>

              <p className="text-lg font-bold">{format(new Date(slot.startTime), 'PPPPp', { locale: enUS })}</p>
              <p className="text-lg font-bold">{format(new Date(slot.endTime), 'PPPPp', { locale: enUS })}</p>

              <p className="text-sm mb-2">{slot.status}</p>
            </div>
          ))
        ) : (
          <p className="text-lg">No slots available</p>
        )}
      </div>
    </div>
  );
}

export default Slots;
