import React, { useContext, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import logo from '../assets/logo.png';

export default function Login() {
  const [name, setName] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const normalizePhone = (v) => {
    const digits = (v || '').replace(/\D/g, '');
    // 고객은 1(국가번호) 없이 입력 가능 → 10자리면 앞에 1 붙여서 보냄
    if (digits.length === 10) return '1' + digits;
    // 이미 1로 시작하고 총 11자리면 그대로
    if (digits.length === 11 && digits.startsWith('1')) return digits;
    // 그 외는 일단 있는 그대로(백엔드에서 추가 검증)
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.get('/api/customer', {
        params: {
          name: name.trim(),
          phone: normalizePhone(phoneRaw),
        },
      });

      if (response.data?.success) {
        login(response.data);
        navigate('/home');
      } else {
        setErrorMsg(
          response.data?.message || 'Could not verify the information.'
        );
      }
    } catch (error) {
      console.error('Login API Error: ', error);
      setErrorMsg('Sorry, failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* 본문 */}
      <main className='relative z-10 container py-10 md:py-14'>
        {/* 로고 */}
        <div className='flex justify-center'>
          <img
            src={logo}
            alt='K-Town'
            className='h-12 md:h-14 lg:h-16 w-auto object-contain select-none'
          />
        </div>

        {/* 제목 + 밑줄 (라운드 바) */}
        <header className='mt-6 text-center'>
          <div className='inline-block'>
            <h1 className='text-3xl md:text-5xl font-bold tracking-tight'>
              K-Town Customer Loyalty
            </h1>
            <div className='mt-3 h-1 md:h-[6px] bg-brand rounded-full' />
          </div>
          <p className='muted mt-4 text-base md:text-lg leading-7'>
            Enter your first name and phone number to view your tier and
            coupons.
          </p>
        </header>

        {/* 카드 폼 */}
        <section className='mt-8 mx-auto max-w-md'>
          <form
            onSubmit={handleSubmit}
            className='rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card'
            noValidate
          >
            {/* 에러 메시지 */}
            {errorMsg && (
              <div className='mb-4 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
                {errorMsg}
              </div>
            )}

            {/* 이름 */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                First Name
              </label>
              <input
                type='text'
                id='name'
                placeholder='Your first name'
                autoComplete='given-name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='mt-1 w-full h-11 rounded-xl border border-border bg-white px-3
                           placeholder:text-gray-400 focus-thin'
              />
            </div>

            {/* 전화번호 */}
            <div className='mt-4'>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700'
              >
                Phone Number
              </label>
              <input
                type='tel'
                id='phone'
                inputMode='numeric'
                autoComplete='tel'
                placeholder='10-digit phone number (Numbers only)'
                value={phoneRaw}
                onChange={(e) => setPhoneRaw(e.target.value)}
                required
                className='mt-1 w-full h-11 rounded-xl border border-border bg-white px-3
                           placeholder:text-gray-400 focus-thin'
                aria-describedby='phone-help'
                aria-invalid={!!errorMsg}
              />
              <p id='phone-help' className='muted mt-1 text-sm'>
                You can skip country code. We’ll match it to <strong>+1</strong>{' '}
                automatically.
              </p>
            </div>

            {/* 제출 */}
            <div className='mt-6'>
              <Button
                type='submit'
                variant='primary'
                size='lg'
                fullWidth
                loading={loading}
                loadingText='Verifying...'
              >
                Verify
              </Button>
            </div>
          </form>

          {/* 도움말 링크 (선택) */}
          <p className='muted text-sm mt-4 text-center'>
            Trouble logging in? <br />
            Check the spelling of your first name or phone number.
          </p>
        </section>
      </main>
    </div>
  );
}
