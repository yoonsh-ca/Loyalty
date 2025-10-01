import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import Barcode from 'react-barcode';
import CouponCard from '../components/CouponCard';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { FaRotateRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { customer, login } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  // New: Combine first name and last name for full display
  const fullName = [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(' ');

  const fetchCustomerData = useCallback(async () => {
    // Check using the new property name: firstName
    if (!customer?.phone_number || !customer?.firstName) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.get('/api/customer', {
        params: {
          // Send the firstName as the 'name' query parameter
          name: customer.firstName,
          phone: customer.phone_number,
        },
      });
      if (response.data.success) {
        // Assuming your login context correctly updates state with new data structure (firstName, lastName)
        login(response.data.data);
      } else {
        // Navigate to the centralized error page if data fetching fails
        navigate('/error', {
          state: {
            message:
              response.data.message || 'Failed to refresh customer data.',
          },
        });
      }
    } catch (error) {
      console.error('Failed to refresh customer data: ', error);
      // Navigate to the centralized error page on network failure
      navigate('/error', {
        state: {
          message:
            'Failed to retrieve the latest customer data due to a network error.',
        },
      });
    } finally {
      setLoading(false);
    }
  }, [customer, login, navigate]);

  // initial data listener
  useEffect(() => {
    if (customer && customer.coupons) {
      setCoupons(customer.coupons);
    }
  }, [customer]);

  const handleUseCoupon = async (couponId) => {
    try {
      const pageId = customer.pageId;
      const response = await axios.post('/api/coupon/update', {
        pageId,
        couponId,
      });

      if (response.data.success) {
        // Use custom modal or message box instead of alert()
        console.log('Coupon has used!');
        fetchCustomerData();
      } else {
        // Use custom modal or message box instead of alert()
        console.log('Cannot use this coupon: ' + response.data.message);
      }
    } catch (error) {
      console.error('Failed to update coupon status: ' + error);
      navigate('/error', {
        state: { message: 'Failed to update coupon status.' },
      });
    }

    // optimistic UI
    const nextCoupons = coupons.map((coupon) =>
      coupon.id === couponId ? { ...coupon, used: true } : coupon
    );
    setCoupons(nextCoupons);
  };

  // 유효/미사용 쿠폰만
  const availableCoupons = coupons.filter((coupon) => {
    const today = new Date();
    const expiryDate = new Date(coupon.expiry_date);
    // Ensure we handle invalid dates gracefully
    if (isNaN(expiryDate)) return false;
    return !coupon.used && expiryDate >= today;
  });

  return (
    <div>
      <Navbar />

      {/* 배경 워시 */}
      <div
        className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
        aria-hidden
      >
        <div
          className='absolute -top-28 right-[-160px] h-[420px] w-[420px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.07)' }}
        />
        <div
          className='absolute bottom-[-140px] -left-28 h-[360px] w-[360px] rounded-full blur-3xl'
          style={{ backgroundColor: 'rgba(var(--brand-pink-rgb), 0.06)' }}
        />
      </div>

      <main className='relative z-10 container py-10 md:py-14'>
        {/* 로그인 전: 웰컴 섹션 */}
        {!customer && (
          <>
            <header className='text-center'>
              <div className='inline-block'>
                <h1 className='flex gap-3 text-3xl md:text-5xl font-bold tracking-tight'>
                  Welcome to
                  <div>
                    K-Town in Edmonton!
                    <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
                  </div>
                </h1>
              </div>
              <p className='muted mt-4 max-w-2xl mx-auto text-base md:text-lg leading-7 md:leading-8'>
                Explore our store info, loyalty benefits, events and social
                channels.
              </p>
            </header>

            <section className='mt-8 grid gap-3 max-w-md mx-auto'>
              <Button as='link' to='/about' variant='outline' fullWidth>
                About us
              </Button>
              <Button as='link' to='/benefits' variant='outline' fullWidth>
                Benefits
              </Button>
              <Button as='link' to='/events' variant='outline' fullWidth>
                Events
              </Button>
              <Button as='link' to='/sns' variant='outline' fullWidth>
                Our SNS
              </Button>
              <Button as='link' to='/faq' variant='outline' fullWidth>
                FAQ
              </Button>
            </section>
          </>
        )}

        {/* 로그인 후: 회원 섹션 */}
        {customer && (
          <>
            {/* 타이틀 */}
            <header>
              <div className='inline-block'>
                <h1 className='flex gap-2 text-3xl md:text-5xl font-bold tracking-tight'>
                  Hello,
                  <div>
                    {customer.firstName || 'Member'}! {/* Display full name */}
                    <div className='mt-2 h-1 md:h-[6px] bg-brand rounded-full' />
                  </div>
                </h1>
              </div>
              <p className='muted mt-4 text-base md:text-lg leading-7'>
                Here’s your membership info and available coupons.
              </p>
            </header>

            {/* 프로필 카드 (이름/티어) */}
            <section className='mt-6'>
              <div className='rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm muted'>Member</p>
                  <p className='text-xl md:text-2xl font-semibold'>
                    {fullName || customer.firstName} {/* Display full name */}
                  </p>
                </div>
                {customer.tier && (
                  <div className='inline-grid place-items-center h-8 px-3 rounded-full bg-brand text-white text-sm font-medium'>
                    {customer.tier}
                  </div>
                )}
              </div>
            </section>

            {/* 바코드 카드 (Refresh 버튼 제거됨) */}
            {customer.phone_number && (
              <section className='mt-6'>
                <div className='rounded-2xl border border-border bg-white p-5 md:p-6 shadow-card'>
                  <div className='flex items-center justify-between'>
                    <p className='text-base font-semibold'>
                      Membership Barcode
                    </p>
                  </div>
                  <div className='mt-4 rounded-xl border border-border bg-white p-3 overflow-auto flex justify-center md:justify-start'>
                    <Barcode value={customer.phone_number} />
                  </div>
                  <p className='muted text-sm mt-3'>
                    Show this barcode at checkout to earn points and redeem
                    coupons.
                  </p>
                  {errorMsg && (
                    <div className='mt-3 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-danger'>
                      {errorMsg}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 쿠폰 섹션 (여기에 Refresh 버튼 배치) */}
            <section className='mt-8'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>
                  Available Coupons
                  <span className='ml-2 inline-grid place-items-center h-7 px-3 rounded-full bg-gray-100 text-gray-700 text-xs font-medium align-middle'>
                    {availableCoupons.length}
                  </span>
                </h2>

                <Button
                  onClick={fetchCustomerData}
                  variant='outline'
                  size='md'
                  startIcon={<FaRotateRight size={16} aria-hidden='true' />}
                  loading={loading}
                  loadingText='Refreshing...'
                />
              </div>

              <div className='mt-4'>
                {availableCoupons.length > 0 ? (
                  <ul className='grid gap-4 md:grid-cols-2'>
                    {availableCoupons.map((coupon) => (
                      <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        onUseCoupon={handleUseCoupon}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className='rounded-xl border border-border bg-white px-4 py-6'>
                    <p className='muted'>There&apos;s no available coupon.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
