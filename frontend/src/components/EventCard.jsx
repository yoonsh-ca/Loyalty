// src/components/EventCard.jsx
import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const statusStyles = {
  UPCOMING: 'bg-brand text-white',
  ONGOING: 'bg-success text-white',
  EXPIRED: 'bg-gray-200 text-gray-600',
};

export default function EventCard({ event }) {
  const { event: title, status = '', period = {}, description } = event || {};
  const upper = String(status).toUpperCase();
  const badge = statusStyles[upper] || 'bg-gray-200 text-gray-600';

  let periodText = '';
  if (period.start && period.end) {
    periodText =
      period.start === period.end
        ? formatDate(period.start)
        : `${formatDate(period.start)} ~ ${formatDate(period.end)}`;
  }

  return (
    <article className='p-6 rounded-xl border border-border bg-white shadow-card hover:shadow-md transition-shadow h-full'>
      <div className='flex flex-col h-full'>
        <span
          className={`inline-grid place-items-center h-7 px-3 mb-3 rounded-full text-xs font-medium self-start ${badge}`}
        >
          {upper || 'UNKNOWN'}
        </span>

        <h2 className='text-lg font-semibold leading-6'>{title}</h2>

        <p className='muted mt-2 text-sm min-h-[1.25rem]'>
          {periodText || '\u00A0'}
        </p>

        {description && <p className='mt-3 text-sm leading-6'>{description}</p>}
      </div>
    </article>
  );
}
