import Navbar from '../components/Navbar';
import { FaInstagram, FaTiktok, FaWebAwesome } from 'react-icons/fa6';

export default function Sns() {
  return (
    <div>
      <Navbar />

      {/* 배경 워시 레이어 (본문 뒤, 헤더 아래) */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        {/* 우상단 워시 */}
        <div
          className='absolute -top-24 right-[-140px] h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.09)' }}
        />
        {/* 좌하단 워시 */}
        <div
          className='absolute bottom-[-120px] -left-24 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.07)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        {/* 헤더 */}
        <header>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
            K-Town SNS
          </h1>
          <div className='mt-3 h-1 w-40 md:w-56 bg-brand rounded-full' />
          <p className='muted mt-4 max-w-2xl text-base md:text-lg leading-7 md:leading-8'>
            Follow our official channels and get the latest updates, events, and
            promos.
          </p>
        </header>

        {/* 링크 리스트 (세로 스택, 버튼 내부는 text-align 으로 중앙 정렬) */}
        <section className='mt-8'>
          <div className='grid gap-3 max-w-md'>
            {/* Website */}
            <a
              href='https://www.kplaytown.ca'
              target='_blank'
              rel='noreferrer'
              aria-label='Open K-Town website'
              className='
                btn-primary w-full rounded-xl
                flex h-11 text-center justify-center  /* 고정 높이 + 라인하이트로 수직/가로 중앙 */
                hover:opacity-90 transition-opacity select-none
                whitespace-nowrap
              '
            >
              <FaWebAwesome
                size={22}
                aria-hidden='true'
                className='inline align-middle mr-2'
              />
              <span className='inline align-middle'>Website</span>
            </a>

            {/* Instagram */}
            <a
              href='https://www.instagram.com/ktown_edmonton'
              target='_blank'
              rel='noreferrer'
              aria-label='Open Instagram'
              className='
                btn-outline w-full rounded-xl
                flex h-11 text-center justify-center
                hover:bg-gray-100 transition-colors select-none
                whitespace-nowrap
              '
            >
              <FaInstagram
                size={22}
                aria-hidden='true'
                className='inline align-middle mr-2'
              />
              <span className='inline align-middle'>Instagram</span>
            </a>

            {/* TikTok */}
            <a
              href='https://www.tiktok.com/@ktownsgm'
              target='_blank'
              rel='noreferrer'
              aria-label='Open TikTok'
              className='
                btn-outline w-full rounded-xl
                flex h-11 text-center justify-center
                hover:bg-gray-100 transition-colors select-none
                whitespace-nowrap
              '
            >
              <FaTiktok
                size={22}
                aria-hidden='true'
                className='inline align-middle mr-2'
              />
              <span className='inline align-middle'>TikTok</span>
            </a>
          </div>

          {/* 안내문구 */}
          <p className='muted text-sm mt-4'>
            External links open in a new tab.
          </p>
        </section>
      </main>
    </div>
  );
}
