import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
        {/* 로고: 항상 왼쪽 */}
        <div className='justify-self-start'>
          <Link to={customer ? '/home' : '/'}>
            <img
              src={logo}
              alt='K-Town'
              className='h-10 md:h-12 lg:h-14 w-auto object-contain select-none'
            />
          </Link>
        </div>

        {/* 메뉴: 데스크탑에서 로고 옆에 살짝 붙여 배치 */}
        <div className='hidden md:flex items-center justify-start md:pl-6 divide-x divide-border rounded-xl'>
          {customer &&
            navItems.map((i) => (
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

        {/* 오른쪽: 모바일=햄버거 / 데스크탑=로그아웃 */}
        <div className='justify-self-end flex items-center gap-3 md:gap-4'>
          {customer ? (
            <>
              {/* 모바일 햄버거: 테두리 제거, 호버만 회색 */}
              <button
                className='
                  md:hidden inline-grid place-items-center h-10 w-10 rounded-xl
                  transition-colors duration-200 hover:bg-gray-100
                  focus-thin
                '
                aria-label='Toggle menu'
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <svg
                  width='22'
                  height='22'
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
              </button>

              {/* 데스크탑 로그아웃 */}
              <button
                onClick={logout}
                className='
                  hidden md:inline-grid place-items-center
                  h-10 md:h-11 lg:h-12 px-4 md:px-5 rounded-xl
                  border-2 border-brand text-brand font-semibold
                  transition-colors duration-200
                  hover:bg-brand hover:text-white
                  focus:outline-none focus:ring-4 focus:ring-brand/20
                '
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to='/'
              className='
                inline-grid place-items-center
                h-10 md:h-11 lg:h-12 px-4 md:px-5 rounded-xl
                bg-brand text-white font-semibold
                transition-colors duration-200 hover:opacity-90
                focus:outline-none focus:ring-4 focus:ring-brand/20
              '
            >
              Log In
            </Link>
          )}
        </div>
      </nav>

      {/* 모바일 드롭다운: 로그아웃 최상단 + 부드러운 전환 */}
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
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className='
                inline-grid place-items-center h-10 px-4 rounded-xl
                border-2 border-brand text-brand font-semibold
                transition-colors duration-200
                hover:bg-brand hover:text-white
                focus:outline-none focus:ring-4 focus:ring-brand/20
              '
            >
              Log Out
            </button>

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
        )}
      </div>
    </header>
  );
}
