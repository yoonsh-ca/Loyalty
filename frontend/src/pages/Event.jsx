import axios from 'axios';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
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

  // 상태별 카운트
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

      {/* 배경 워시 (은은하게) */}
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
        {/* 1) 헤더 */}
        <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
          Events
        </h1>

        {/* 2) 설명 + Refresh (한 줄 정렬) */}
        <div className='mt-3 md:flex md:items-center md:justify-between gap-4'>
          <p className='muted max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            Check ongoing and upcoming events. Use the filter below.
          </p>

          <button
            onClick={fetchEvents}
            disabled={loading}
            aria-busy={loading}
            className='
              mt-3 md:mt-0
              inline-flex items-center gap-2
              h-10 px-4 rounded-xl
              border border-border
              hover:bg-gray-100 transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed
            '
          >
            {/* ✅ 로딩 중 회전 */}
            <FaRotateRight
              size={16}
              aria-hidden='true'
              className={loading ? 'animate-spin' : ''}
            />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* 3) 버튼 컨테이너(디자인 적용) */}
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
                <button
                  key={key}
                  role='tab'
                  aria-selected={active}
                  onClick={() => setFilterStatus(key)}
                  className={[
                    'h-10 rounded-lg px-3 text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand text-white'
                      : 'border border-border bg-white hover:bg-gray-100',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  <span
                    className={
                      active ? 'ml-2 opacity-90' : 'ml-2 text-gray-500'
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4) 이벤트 카드 목록 (컨테이너 디자인 없음) */}
        <div className='mt-6'>
          {/* 로딩 스켈레톤 */}
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

          {/* 에러 */}
          {!loading && error && (
            <div className='rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
              {error}
            </div>
          )}

          {/* 정상 */}
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
