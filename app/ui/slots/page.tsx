
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  backgroundColor?: string;
}

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales,
});

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
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSlots = await fetchSlots();
      setSlots(fetchedSlots);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = slots.filter(slot =>
      slot.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.endTime.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSlots(results);
  }, [searchTerm, slots]);

  const events = filteredSlots.map(slot => ({
    title: `Slot ${slot.id}`,
    start: new Date(slot.startTime),
    end: new Date(slot.endTime),
    allDay: false,
    resource: {
      backgroundColor: slot.backgroundColor,
    },
  }));

  const eventPropGetter = (event: any) => {
    const backgroundColor = event.resource?.backgroundColor || 'white';
    return { style: { backgroundColor } };
  };

  return (
    <div>
      <h2>Available Slots</h2>
      <div className="p-4 mb-4">
        <h2 className="text-2xl mb-4">Search</h2>
        <input type="text" placeholder="Search..." className="w-full p-2 mb-4 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventPropGetter}
        />
      </div> */}
        <li className="border p-4 mb-4">
          id - startTime - endTime
          </li>
      {filteredSlots.length > 0 ? (
      
        <ul>
          {filteredSlots.map(slot => (
            <li key={slot.id} className="border p-4 mb-4">
              {slot.id}-{slot.startTime} - {slot.endTime}
            </li>
          ))}
        </ul>
      ) : (
        <p>No slots available</p>
      )}
    </div>
  );
}

export default Slots;
