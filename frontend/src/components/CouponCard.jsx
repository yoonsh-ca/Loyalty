import React, { useState } from 'react';

export default function CouponCard({ coupon, onUseCoupon }) {
  const handleButtonClick = () => {
    // 1. confirm
    const isConfirmed = window.confirm(`Use this coupon?
      Once confirmed, this coupon cannot be used again.`);

    // 2-1. not confirmed, return to page
    if (!isConfirmed) return;

    // 2-2. confirmed, change the coupon status
    console.log(`Used Coupon: CouponID ${coupon.id}`);
    onUseCoupon(coupon.id);
    // TODO: Add API connection here to change coupon used status
  };

  return (
    <li>
      <p>{coupon.name}</p>
      <p>Expiry Date: {coupon.expiry_date}</p>

      {coupon.used ? (
        <p>Used Coupon</p>
      ) : (
        <button onClick={handleButtonClick}>Use</button>
      )}
    </li>
  );
}
