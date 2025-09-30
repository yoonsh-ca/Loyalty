import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/home', label: 'My Account' },
  { to: '/about', label: 'About' },
  { to: '/benefits', label: 'Benefits' },
  { to: '/events', label: 'Events' },
  { to: '/sns', label: 'SNS' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const { customer, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // 모바일용 기존 클래스 유지 (언더라인 효과)
  const linkBase =
    'group relative px-4 py-2 rounded-lg transition-colors duration-200 focus-thin';
  const linkIdle = 'text-black hover:text-brand hover:bg-gray-200';
  const linkActiveMobile = 'text-brand after:opacity-100 after:scale-x-100';
  const linkUnderline =
    "after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-1 " +
    'after:h-0.5 after:bg-brand after:rounded-full after:transition-transform after:duration-200 ' +
    'after:origin-left after:opacity-0 after:scale-x-0';

  return (
    <header className='sticky top-0 z-40 bg-white border-b border-border transition-shadow duration-200'>
      <nav
        className='
          container h-16 md:h-20 grid items-center
          grid-cols-[auto_1fr_auto]
          md:grid-cols-[auto_max-content_1fr]
          md:gap-x-4
        '
      >
        {/* 로고 */}
        <div className='justify-self-start'>
          <Link to={customer ? '/home' : '/'}>
            <img
              src={logo}
              alt='K-Town'
              className='h-10 md:h-12 lg:h-14 w-auto object-contain select-none'
            />
          </Link>
        </div>

        {/* 데스크탑 메뉴: Button 컴포넌트 사용 */}
        <div className='hidden md:flex items-center justify-start md:pl-6 gap-1'>
          {customer &&
            navItems.map((i) => {
              const active = isActive(i.to);
              return (
                <Button
                  key={i.to}
                  as='link'
                  to={i.to}
                  size='md'
                  variant={active ? 'primary' : 'ghost'}
                  className={active ? 'shadow-sm' : 'hover:text-brand'}
                >
                  {i.label}
                </Button>
              );
            })}
        </div>

        {/* 우측 영역: 모바일 햄버거 / 데스크탑 로그아웃 */}
        <div className='justify-self-end flex items-center gap-3 md:gap-4'>
          {customer ? (
            <>
              {/* 모바일 햄버거 (유지) */}
              <button
                className='
                  md:hidden inline-grid place-items-center h-12 w-12 rounded-xl
                  transition-colors duration-200 hover:bg-gray-200
                  focus-thin
                '
                aria-label='Toggle menu'
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M4 7h16M4 12h16M4 17h16'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
              </button>

              {/* 데스크탑 로그아웃도 Button으로 통일 */}
              <Button
                onClick={logout}
                variant='primary'
                size='md'
                className='hidden md:inline-flex'
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button as='link' to='/' variant='primary' size='md'>
              Log In
            </Button>
          )}
        </div>
      </nav>

      {/* 모바일 드롭다운: 기존 스타일 유지(언더라인 효과) */}
      <div
        className={[
          'md:hidden overflow-hidden border-t border-border',
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          open && customer ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        style={{ willChange: 'height, opacity' }}
      >
        {customer && (
          <div
            className={[
              'container py-3 grid gap-2 transform-gpu',
              'transition-transform duration-300 motion-reduce:transition-none',
              open ? 'translate-y-0' : '-translate-y-1',
            ].join(' ')}
            style={{ willChange: 'transform' }}
          >
            <Button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              variant='primary'
              size='md'
              fullWidth
            >
              Log Out
            </Button>

            {/* 모바일 메뉴는 기존 언더라인 유지 */}
            {navItems.map((i) => {
              const active = isActive(i.to);
              return (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setOpen(false)}
                  className={[
                    'block',
                    linkBase,
                    linkUnderline,
                    active ? linkActiveMobile : linkIdle,
                  ].join(' ')}
                >
                  {i.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
