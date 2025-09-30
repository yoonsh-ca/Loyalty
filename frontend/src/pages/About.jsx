import Button from '../components/ui/Button';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div>
      <Navbar />

      {/* 배경 워시 */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        <div
          className='absolute -top-36 -left-32 h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.10)' }}
        />
        <div
          className='absolute top-40 right-[-120px] h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.08)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        <header>
          <div className='inline-block max-w-[40ch]'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              About K-Town
            </h1>
            <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <p className='muted mt-4 max-w-3xl text-base md:text-lg leading-7 md:leading-8'>
            A one-stop playground for K-culture lovers in Edmonton.
          </p>
        </header>

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

        {/* CTA 버튼들 → Button 컴포넌트로 교체 */}
        <section className='mt-10 flex flex-wrap gap-3'>
          <Button as='link' to='/sns' variant='outline' size='md'>
            Follow our SNS
          </Button>
          <Button as='link' to='/events' variant='primary' size='md'>
            See Events
          </Button>
        </section>
      </main>
    </div>
  );
}
