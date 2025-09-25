import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function EventCard({ event }) {
  const { event: eventTitle, status, period } = event;

  let periodText = '';
  if (period.start && period.end) {
    if (period.start === period.end) {
      periodText = formatDate(period.start);
    } else {
      periodText = `${formatDate(period.start)} ~ ${formatDate(period.end)}`;
    }
  }

  return (
    <div>
      <div>
        <h2>{eventTitle}</h2>
        <p>{status}</p>
        <p>{periodText}</p>
      </div>
    </div>
  );
}
