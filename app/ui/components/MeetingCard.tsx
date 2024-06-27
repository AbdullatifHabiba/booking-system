import React from 'react';

interface Meeting {
  id: number;
  meetingId: string;
  startTime: string;
  duration: number;
}

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <div>
      <h3>Meeting ID: {meeting.meetingId}</h3>
      <p>Start Time: {new Date(meeting.startTime).toLocaleString()}</p>
      <p>Duration: {meeting.duration} minutes</p>
    </div>
  );
};

export default MeetingCard;
