// src/components/CouponCard.jsx
import React from 'react';
import Button from './ui/Button';

const formatDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function CouponCard({ coupon, onUseCoupon }) {
  const title = coupon?.name || 'Coupon';
  const expiryDate = coupon?.expiry_date ? new Date(coupon.expiry_date) : null;

  // 오늘 00:00 기준
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isExpired = expiryDate ? expiryDate < today0 : false;
  const isUsed = !!coupon?.used;

  // 상태 라벨/배지 색
  const status = isUsed ? 'Used' : isExpired ? 'Expired' : 'Available';
  const badgeCls = {
    Available: 'bg-brand text-white',
    Used: 'bg-gray-300 text-gray-700',
    Expired: 'bg-gray-200 text-gray-600',
  }[status];

  // 남은 날짜 텍스트 + 임박 여부
  let daysLeftText = '';
  let imminent = false;
  if (expiryDate && !isExpired) {
    const diffDays = Math.ceil((expiryDate - today0) / (1000 * 60 * 60 * 24));
    imminent = diffDays <= 3; // ✅ 3일 이하 임박
    if (diffDays === 0) daysLeftText = 'Ends today';
    else if (diffDays === 1) daysLeftText = '1 day left';
    else daysLeftText = `${diffDays} days left`;
  }
  const daysLeftBadgeCls = imminent
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-gray-700';

  const expiryText = expiryDate ? formatDate(expiryDate) : 'No expiry';
  const disabled = isUsed || isExpired;

  const handleButtonClick = () => {
    const ok = window.confirm(
      'Use this coupon?\nOnce confirmed, this coupon cannot be used again.'
    );
    if (!ok) return;
    onUseCoupon?.(coupon.id);
  };

  return (
    <li className='p-5 md:p-6 rounded-xl border border-border bg-white shadow-card hover:shadow-md transition-shadow'>
      {/* 헤더: 제목 + 상태 배지 */}
      <div className='flex items-start justify-between gap-3'>
        <h3
          className={`text-base md:text-lg font-semibold leading-6 ${
            disabled ? 'line-through text-gray-500' : ''
          }`}
        >
          {title}
        </h3>
        <span
          className={`inline-grid place-items-center h-7 px-3 rounded-full text-xs font-medium ${badgeCls}`}
        >
          {status}
        </span>
      </div>

      {/* 만료일 + 남은기간 */}
      <div className='mt-2 flex items-center gap-2 text-sm'>
        {/* 캘린더 아이콘 */}
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          className='text-gray-500'
        >
          <rect
            x='3'
            y='4'
            width='18'
            height='18'
            rx='2'
            stroke='currentColor'
            strokeWidth='2'
          />
          <path
            d='M16 2v4M8 2v4M3 10h18'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
        <span className='muted'>
          Expiry:&nbsp;<span className='text-black'>{expiryText}</span>
        </span>

        {daysLeftText && (
          <span
            className={`ml-2 inline-grid place-items-center h-6 px-2 rounded-full text-[11px] ${daysLeftBadgeCls}`}
          >
            {daysLeftText}
          </span>
        )}
      </div>

      {/* 설명(옵션) */}
      {coupon?.description && (
        <p className='mt-3 text-sm leading-6'>{coupon.description}</p>
      )}

      {/* 액션: 중앙정렬 + 가로꽉 */}
      <div className='mt-4 flex justify-center'>
        <Button
          onClick={handleButtonClick}
          variant={disabled ? 'outline' : 'primary'}
          size='sm'
          fullWidth
          disabled={disabled}
        >
          {disabled ? (isUsed ? 'Used' : 'Expired') : 'Use'}
        </Button>
      </div>
    </li>
  );
}
