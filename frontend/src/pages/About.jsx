import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div>
      <Navbar />

      {/* 배경 워시 레이어 (본문 뒤, 헤더 아래) */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        {/* 좌상단 워시 */}
        <div
          className='absolute -top-36 -left-32 h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.10)' }}
        />
        {/* 우측 중단 워시 */}
        <div
          className='absolute top-40 right-[-120px] h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.08)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        {/* 헤더 */}
        <header>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
            About K-Town
          </h1>
          <div className='mt-3 h-1 w-40 md:w-56 bg-brand rounded-full' />
          <p className='muted mt-4 max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            A one-stop playground for K-culture lovers in Edmonton.
          </p>
        </header>

        {/* 본문 (플랫) */}
        <section className='mt-8 max-w-3xl space-y-5 text-base md:text-lg leading-7 md:leading-8'>
          <p>
            K-town is a complex play space where you can enjoy various contents
            such as coin noraebang, sticker photo shoot, and doll drawing, along
            with selling the hottest K-pop idol albums and goods these days. You
            can enjoy a fun time singing with friends, 4 cuts of life that can
            leave that time as a memory, and a one-stop collection of rare
            goods.
          </p>
          <p>
            Starting with the first store at The City of Lougheed Shopping
            Center located in Southgate, Edmonton, in October 2024, we plan to
            gradually increase our business locations.
          </p>
        </section>

        {/* (선택) 콜투액션 */}
        <section className='mt-10 flex flex-wrap gap-3'>
          <Link
            to='/sns'
            className='inline-grid place-items-center h-11 px-5 rounded-xl border border-border hover:bg-gray-100 transition-colors'
          >
            Follow our SNS
          </Link>
          <Link
            to='/events'
            className='inline-grid place-items-center h-11 px-5 rounded-xl bg-brand text-white hover:opacity-90 transition-opacity'
          >
            See Events
          </Link>
        </section>
      </main>
    </div>
  );
}
