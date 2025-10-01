import axios from '../api/axios';
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';

export default function Benefit() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBenefits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/benefit');
      setBenefits(res.data || []);
    } catch (err) {
      console.error('Failed to fetch benefits data: ', err);
      setError('Failed to load benefits. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

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
        <header>
          <div className='inline-block max-w-[40ch]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              Benefits by Tier
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <p className='muted mt-4 max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            Check your tier perks and minimum spending requirements.
          </p>
        </header>

        {/* 로딩 */}
        {loading && (
          <section className='mt-8'>
            <div className='mx-auto max-w-5xl grid gap-6 md:grid-cols-2'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='p-6 rounded-xl border border-border bg-white animate-pulse'
                >
                  <div className='h-6 w-28 rounded-full bg-gray-100' />
                  <div className='mt-3 h-4 w-48 rounded bg-gray-100' />
                  <ul className='mt-4 space-y-2'>
                    <li className='h-4 w-5/6 rounded bg-gray-100' />
                    <li className='h-4 w-4/6 rounded bg-gray-100' />
                    <li className='h-4 w-3/6 rounded bg-gray-100' />
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && error && (
          <section className='mt-8'>
            <div className='rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
              {error}
            </div>
            <Button
              onClick={fetchBenefits}
              variant='outline'
              size='md'
              className='mt-4'
            >
              Retry
            </Button>
          </section>
        )}

        {!loading && !error && (
          <section className='mt-8'>
            {benefits.length > 0 ? (
              <div className='grid gap-6 md:grid-cols-2 mx-auto max-w'>
                {benefits.map((tier) => (
                  <article
                    key={tier.id}
                    className='p-6 rounded-xl border border-border bg-white shadow-card hover:shadow-md transition-shadow'
                  >
                    <div className='inline-grid place-items-center h-8 px-3 rounded-full bg-brand text-white text-sm font-medium'>
                      {tier.tier}
                    </div>

                    <p className='muted text-sm mt-2'>
                      Minimum spending amount:{' '}
                      <span className='font-medium text-black'>
                        ${Number(tier.min_spending || 0).toLocaleString()}
                      </span>
                    </p>

                    <ul className='mt-4 space-y-2'>
                      {(tier.benefits || []).map((b, idx) => (
                        <li key={idx} className='text-sm leading-6'>
                          <span className='inline-block align-middle mr-2'>
                            <svg
                              width='16'
                              height='16'
                              viewBox='0 0 24 24'
                              fill='none'
                              className='text-brand'
                            >
                              <path
                                d='M20 6L9 17l-5-5'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </span>
                          <span className='align-middle'>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <div className='mt-6 rounded-xl border border-border bg-white px-4 py-6'>
                <p className='muted'>There is no data to show.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
