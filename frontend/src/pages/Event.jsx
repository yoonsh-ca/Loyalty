import axios from 'axios';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { FaRotateRight } from 'react-icons/fa6';

export default function Event() {
  const [events, setEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/event');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch events: ', err);
      setError('Failed to load event data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const counts = useMemo(() => {
    const c = { all: 0, upcoming: 0, ongoing: 0, expired: 0 };
    for (const e of events) {
      c.all += 1;
      const s = String(e?.status || '').toLowerCase();
      if (s.includes('upcoming')) c.upcoming += 1;
      else if (s.includes('ongoing')) c.ongoing += 1;
      else if (s.includes('expired')) c.expired += 1;
    }
    return c;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (filterStatus === 'all') return events;
    const key = filterStatus.toUpperCase();
    return events.filter((e) =>
      String(e?.status || '')
        .toUpperCase()
        .includes(key)
    );
  }, [events, filterStatus]);

  return (
    <div>
      <Navbar />

      {/* 배경 워시 */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        <div
          className='absolute -top-28 right-[-160px] h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.07)' }}
        />
        <div
          className='absolute bottom-[-140px] -left-28 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.06)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        <div>
          {/* 타이틀 */}
          <div className='inline-block max-w-[40ch]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              Events
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>

          {/* 설명 + Refresh */}
          <p className='muted max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            Check ongoing and upcoming events. Use the filter below.
          </p>

          <Button
            onClick={fetchEvents}
            variant='outline'
            size='md'
            startIcon={<FaRotateRight size={16} aria-hidden='true' />}
            loading={loading}
            loadingText='Refreshing...'
          />
        </div>

        {/* 필터 버튼 컨테이너 */}
        <div className='mt-6 rounded-2xl border border-border bg-white p-2 md:p-3 shadow-card'>
          <div
            className='grid grid-cols-4 gap-2 md:gap-3'
            role='tablist'
            aria-label='Filter events by status'
          >
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
              { key: 'ongoing', label: 'Ongoing', count: counts.ongoing },
              { key: 'expired', label: 'Expired', count: counts.expired },
            ].map(({ key, label, count }) => {
              const active = filterStatus === key;
              return (
                <Button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  variant={active ? 'primary' : 'outline'}
                  size='md'
                  className='h-10'
                  role='tab'
                  aria-selected={active}
                >
                  <>
                    <span>{label}</span>
                    <span
                      className={
                        active ? 'ml-2 opacity-90' : 'ml-2 text-gray-500'
                      }
                    >
                      {count}
                    </span>
                  </>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 이벤트 카드 목록 */}
        <div className='mt-6'>
          {loading && (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='h-6 w-40 rounded bg-gray-100' />
                  <div className='mt-3 h-4 w-28 rounded bg-gray-100' />
                  <div className='mt-4 h-4 w-5/6 rounded bg-gray-100' />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div>
              <div className='rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
                {error}
              </div>
              <Button
                onClick={fetchEvents}
                variant='outline'
                size='md'
                startIcon={<FaRotateRight size={16} aria-hidden='true' />}
                className='mt-4'
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredEvents.length > 0 ? (
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              ) : (
                <div className='rounded-xl border border-border bg-white px-4 py-6'>
                  <p className='muted'>No event data to show.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
