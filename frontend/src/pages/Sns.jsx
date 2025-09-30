import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { FaInstagram, FaTiktok, FaWebAwesome } from 'react-icons/fa6';

export default function Sns() {
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
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.09)' }}
        />
        <div
          className='absolute bottom-[-120px] -left-24 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.07)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        {/* 헤더 */}
        <header>
          <div className='inline-block max-w-[40ch]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              SNS
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <p className='muted mt-4 max-w-2xl text-base md:text-lg leading-7 md:leading-8'>
            Follow our official channels and get the latest updates, events, and
            promos.
          </p>
        </header>

        {/* 채널별 설명 → 버튼 */}
        <section className='mt-8 max-w-2xl grid gap-6'>
          {/* Website */}
          <article>
            <h2 className='text-xl font-semibold'>Website</h2>
            <p className='muted mt-2 leading-7'>
              Browse and purchase <strong>albums</strong> and{' '}
              <strong>K-pop goods</strong> online.
            </p>
            <div className='mt-3'>
              <Button
                as='a'
                href='https://www.kplaytown.ca'
                target='_blank'
                rel='noreferrer noopener'
                variant='primary'
                fullWidth
                startIcon={<FaWebAwesome size={22} aria-hidden='true' />}
              >
                Visit Website
              </Button>
            </div>
          </article>

          <div className='h-px bg-border' />

          {/* Instagram */}
          <article>
            <h2 className='text-xl font-semibold'>Instagram</h2>
            <p className='muted mt-2 leading-7'>
              We post <strong>newly arrived albums</strong> and{' '}
              <strong>upcoming events</strong>.
            </p>
            <div className='mt-3'>
              <Button
                as='a'
                href='https://www.instagram.com/ktown_edmonton'
                target='_blank'
                rel='noreferrer noopener'
                variant='outline'
                fullWidth
                startIcon={<FaInstagram size={22} aria-hidden='true' />}
              >
                Open Instagram
              </Button>
            </div>
          </article>

          <div className='h-px bg-border' />

          {/* TikTok */}
          <article>
            <h2 className='text-xl font-semibold'>TikTok</h2>
            <p className='muted mt-2 leading-7'>
              Watch our <strong>unboxing videos</strong> and fun short clips.
            </p>
            <div className='mt-3'>
              <Button
                as='a'
                href='https://www.tiktok.com/@ktownsgm'
                target='_blank'
                rel='noreferrer noopener'
                variant='outline'
                fullWidth
                startIcon={<FaTiktok size={22} aria-hidden='true' />}
              >
                Open TikTok
              </Button>
            </div>
          </article>

          {/* 안내 */}
          <p className='muted text-sm'>External links open in a new tab.</p>
        </section>
      </main>
    </div>
  );
}
