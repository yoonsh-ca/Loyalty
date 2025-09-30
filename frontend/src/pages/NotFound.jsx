import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  return (
    <div className='relative min-h-screen'>
      {/* 배경 워시 */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        <div
          className='absolute -top-28 right-[-160px] h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.08)' }}
        />
        <div
          className='absolute bottom-[-140px] -left-28 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.06)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        <section className='mx-auto max-w-xl text-center'>
          {/* 큰 숫자 + 타이틀 */}
          <div className='inline-block'>
            <h1 className='text-6xl md:text-7xl font-extrabold tracking-tight text-brand'>
              404
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <h2 className='mt-4 text-2xl md:text-3xl font-semibold'>
            Page Not Found
          </h2>
          <p className='muted mt-3 leading-7'>
            The address you entered does not exist, <br />
            or the requested page has been moved or deleted.
          </p>

          {/* 액션 */}
          <div className='mt-6 grid gap-3 max-w-sm mx-auto'>
            <Button as='link' to='/home' variant='primary' size='md' fullWidth>
              Go to Main
            </Button>
            <Button variant='ghost' size='sm' onClick={handleBack}>
              Go Back
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
