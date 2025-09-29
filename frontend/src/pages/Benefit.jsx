import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';

export default function Benefit() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBenefits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:3001/api/benefit');
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

      {/* 배경 워시 (About/SNS와 톤 맞춤 — 살짝 옅게) */}
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
        {/* 헤더 */}
        <header>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
            Benefits by Tier
          </h1>
          <div className='mt-3 h-1 w-40 md:w-56 bg-brand rounded-full' />
          <p className='muted mt-4 max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            Check your tier perks and minimum spending requirements.
          </p>
        </header>

        {/* 로딩 상태: 스켈레톤 */}
        {loading && (
          <section className='mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
          </section>
        )}

        {/* 에러 상태 */}
        {!loading && error && (
          <section className='mt-8'>
            <div className='rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
              {error}
            </div>
            <button
              onClick={fetchBenefits}
              className='mt-4 inline-grid place-items-center h-11 px-5 rounded-xl border border-border hover:bg-gray-100 transition-colors'
            >
              Retry
            </button>
          </section>
        )}

        {/* 정상 렌더 */}
        {!loading && !error && (
          <section className='mt-8'>
            {benefits.length > 0 ? (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {benefits.map((tier) => (
                  <article
                    key={tier.id}
                    className='p-6 rounded-xl border border-border bg-white shadow-card hover:shadow-md transition-shadow'
                  >
                    {/* 티어 배지 */}
                    <div className='inline-grid place-items-center h-8 px-3 rounded-xl bg-brand text-white text-sm font-medium'>
                      {tier.tier}
                    </div>

                    {/* 최소 금액 */}
                    <p className='muted text-sm mt-2'>
                      Minimum spending amount:{' '}
                      <span className='font-medium text-black'>
                        ${Number(tier.min_spending || 0).toLocaleString()}
                      </span>
                    </p>

                    {/* 혜택 리스트 */}
                    <ul className='mt-4 space-y-2'>
                      {(tier.benefits || []).map((b, idx) => (
                        <li key={idx} className='text-sm leading-6'>
                          <span className='inline-block align-middle mr-2'>
                            {/* 체크 아이콘 (인라인 SVG) */}
                            <svg
                              width='16'
                              height='16'
                              viewBox='0 0 24 24'
                              fill='none'
                              aria-hidden='true'
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
