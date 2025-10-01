// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/benefits', label: 'Benefits' },
  { to: '/events', label: 'Events' },
  { to: '/sns', label: 'SNS' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const { customer, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const linkBase =
    'group relative px-4 py-2 rounded-lg transition-colors duration-200';
  const linkIdle = 'text-black hover:text-brand hover:bg-gray-100';
  const linkActive = 'text-brand after:opacity-100 after:scale-x-100';
  const linkUnderline =
    "after:content-[''] after:absolute after:left-2 after:right-2 after:-bottom-1 " +
    'after:h-0.5 after:bg-brand after:rounded-full after:transition-transform after:duration-200 ' +
    'after:origin-left after:opacity-0 after:scale-x-0';

  return (
    <header className='sticky top-0 z-40 bg-white border-b border-border transition-shadow duration-200'>
      <nav
        className='
          container h-16 md:h-20 grid items-center
          grid-cols-[auto_1fr_auto]          /* 모바일: 로고 | 빈공간 | 햄버거 */
          md:grid-cols-[auto_max-content_1fr] /* 데스크탑: 로고 | 메뉴(폭만큼) | 남는폭 */
          md:gap-x-4
        '
      >
        {/* 로고: 항상 왼쪽 → /home으로 이동 */}
        <div className='justify-self-start'>
          <Link to='/home'>
            <img
              src={logo}
              alt='K-Town'
              className='h-10 md:h-12 lg:h-14 w-auto object-contain select-none'
            />
          </Link>
        </div>

        {/* 메뉴: 데스크탑에서 항상 노출(로그인 여부 무관) */}
        <div className='hidden md:flex items-center justify-start md:pl-6'>
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                [
                  linkBase,
                  linkUnderline,
                  isActive ? linkActive : linkIdle,
                ].join(' ')
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>

        {/* 오른쪽: 모바일=햄버거 / 데스크탑=로그인/로그아웃(분홍색) */}
        <div className='justify-self-end flex items-center gap-3 md:gap-4'>
          {/* 모바일 햄버거: Button 컴포넌트로 아이콘만(ghost) */}
          <Button
            aria-label='Toggle menu'
            onClick={() => setOpen((v) => !v)}
            variant='ghost'
            size='md'
            className='md:hidden h-11 w-11 rounded-xl'
            startIcon={
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                aria-hidden='true'
              >
                <path
                  d='M4 7h16M4 12h16M4 17h16'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            }
          />

          {/* 데스크탑 우측 버튼: 분홍색(primary) */}
          {customer ? (
            <Button
              onClick={logout}
              variant='primary'
              size='md'
              className='hidden md:inline-flex h-10 md:h-11 lg:h-12 px-4 md:px-5'
            >
              Log Out
            </Button>
          ) : (
            <Button
              as='link'
              to='/'
              variant='primary'
              size='md'
              className='hidden md:inline-flex h-10 md:h-11 lg:h-12 px-4 md:px-5'
            >
              Log In
            </Button>
          )}
        </div>
      </nav>

      {/* 모바일 드롭다운: 로그인/비로그인 모두 지원, 최상단에 Log In/Log Out (분홍색) */}
      <div
        className={[
          'md:hidden overflow-hidden border-t border-border',
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          open ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        style={{ willChange: 'height, opacity' }}
      >
        <div
          className={[
            'container py-3 grid gap-2 transform-gpu',
            'transition-transform duration-300 motion-reduce:transition-none',
            open ? 'translate-y-0' : '-translate-y-1',
          ].join(' ')}
          style={{ willChange: 'transform' }}
        >
          {/* 최상단: 로그인/로그아웃 버튼 (primary) */}
          {customer ? (
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
          ) : (
            <Button
              as='link'
              to='/'
              onClick={() => setOpen(false)}
              variant='primary'
              size='md'
              fullWidth
            >
              Log In
            </Button>
          )}

          {/* 링크들: 모바일에서도 항상 노출 */}
          {navItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  'block',
                  linkBase,
                  linkUnderline,
                  isActive ? linkActive : linkIdle,
                ].join(' ')
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
