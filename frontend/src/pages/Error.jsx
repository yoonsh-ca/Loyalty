import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Error() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage =
    location.state?.message ||
    'A server or network error occurred. Please try again.';

  const handleRetry = () => {
    // 현재 페이지 새로고침 (요청 재시도)
    window.location.reload();
  };

  const handleBack = () => {
    // 바로 이전 페이지로 복귀
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
        <section className='mx-auto max-w-lg'>
          <div className='rounded-2xl border border-border bg-white p-6 md:p-8 shadow-card'>
            {/* 헤더 */}
            <div className='text-center'>
              <div className='inline-block'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                  Oops!
                </h1>
                <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
              </div>
              <p className='muted mt-4 leading-7'>{errorMessage}</p>
            </div>

            {/* 액션 */}
            <div className='mt-6 grid gap-3'>
              <Button
                variant='primary'
                size='md'
                onClick={handleRetry}
                fullWidth
              >
                Try Again
              </Button>
              <Button
                as='link'
                to='/home'
                variant='outline'
                size='md'
                fullWidth
              >
                Go to Main
              </Button>
              <Button variant='ghost' size='sm' onClick={handleBack}>
                Go Back
              </Button>
            </div>

            {/* (선택) 기술 상세: 라우터 state로 전달된 message 더보기 */}
            {location.state?.debug && (
              <details className='mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700'>
                <summary className='cursor-pointer select-none'>
                  Technical details
                </summary>
                <pre className='mt-2 whitespace-pre-wrap break-words'>
                  {String(location.state.debug)}
                </pre>
              </details>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
