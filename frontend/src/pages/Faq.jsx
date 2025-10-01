import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/faq');
      setFaqs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch FAQs: ', err);
      setError('Failed to fetch FAQs data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const categories = useMemo(() => {
    const counts = { All: faqs.length };
    for (const f of faqs) {
      const c = f?.category || 'Uncategorized';
      counts[c] = (counts[c] || 0) + 1;
    }
    const list = [
      'All',
      ...Object.keys(counts)
        .filter((k) => k !== 'All')
        .sort(),
    ];
    return { list, counts };
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'All') return faqs;
    return faqs.filter(
      (f) => (f?.category || 'Uncategorized') === selectedCategory
    );
  }, [faqs, selectedCategory]);

  return (
    <div>
      <Navbar />

      {/* 배경 워시 */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        <div
          className='absolute -top-24 right-[-140px] h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.08)' }}
        />
        <div
          className='absolute bottom-[-120px] -left-24 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.06)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        <header>
          <div className='inline-block max-w-[40ch]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              FAQ
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <p className='muted mt-4 max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            Frequently asked questions. Choose a category to find answers
            faster.
          </p>
        </header>

        {/* 카테고리 필터 컨테이너 */}
        <section className='mt-8 rounded-2xl border border-border bg-white p-2 md:p-3 shadow-card'>
          <div
            className='grid auto-cols-max grid-flow-col gap-2 md:gap-3 overflow-x-auto no-scrollbar'
            role='tablist'
            aria-label='Filter FAQs by category'
          >
            {categories.list.map((c) => {
              const active = selectedCategory === c;
              return (
                <Button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  variant={active ? 'primary' : 'outline'}
                  size='md'
                  className='h-10'
                  role='tab'
                  aria-selected={active}
                >
                  <>
                    <span>{c}</span>
                    <span
                      className={
                        active ? 'ml-2 opacity-90' : 'ml-2 text-gray-500'
                      }
                    >
                      {categories.counts[c] ?? 0}
                    </span>
                  </>
                </Button>
              );
            })}
          </div>
        </section>

        <section className='mt-6'>
          {loading && (
            <div className='grid gap-4'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='rounded-xl border border-border bg-white p-4 animate-pulse'
                >
                  <div className='h-5 w-2/3 rounded bg-gray-100' />
                  <div className='mt-3 h-4 w-5/6 rounded bg-gray-100' />
                  <div className='mt-2 h-4 w-4/6 rounded bg-gray-100' />
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
                onClick={fetchFaqs}
                variant='outline'
                size='md'
                className='mt-4'
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredFaqs.length > 0 ? (
                <ul className='grid gap-3'>
                  {filteredFaqs.map((faq) => (
                    <li
                      key={faq.id}
                      className='rounded-xl border border-border bg-white'
                    >
                      <details className='group'>
                        <summary
                          className='
                            list-none cursor-pointer select-none
                            px-4 py-4 md:px-5 md:py-5 rounded-xl
                            transition-colors hover:bg-gray-100
                            flex items-start justify-between gap-3
                          '
                        >
                          <span className='text-base md:text-lg font-medium leading-6'>
                            Q. {faq.question}
                          </span>
                          <svg
                            className='mt-1 h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </summary>
                        <div className='px-4 pb-4 md:px-5 md:pb-5'>
                          <p className='text-sm md:text-base leading-7 whitespace-pre-line break-words'>
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='rounded-xl border border-border bg-white px-4 py-6'>
                  <p className='muted'>There's no FAQ data.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
