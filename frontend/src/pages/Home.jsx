import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Barcode from 'react-barcode';
import CouponCard from '../components/CouponCard';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { customer } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);

  // initial data listener
  useEffect(() => {
    if (customer) {
      const initialCoupons = customer.coupons[0].coupons;
      setCoupons(initialCoupons);
    }
  }, [customer]);

  const handleUseCoupon = (couponId) => {
    console.log(`Home, Clicked the coupon use button: ${couponId}`);

    const nextCoupons = coupons.map((coupon) => {
      if (coupon.id === couponId) {
        return { ...coupon, used: true };
      }
      return coupon;
    });
    setCoupons(nextCoupons);
  };

  if (!customer) {
    return (
      <div>
        <Navbar />
        <h1>Welcom to K-town in Edmonton!</h1>
        <Link to='/about'>About us</Link>
        <Link to='/benefits'>Benefits</Link>
        <Link to='/event'>Event</Link>
        <Link to='/sns'>Our SNS</Link>
        <Link to='/faq'>FAQ</Link>
      </div>
    );
  }

  const availableCoupons = coupons.filter((coupon) => {
    const today = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    return !coupon.used && expiryDate >= today;
  });

  return (
    <div>
      <Navbar />
      <h1>Hello, {customer.name}!</h1>
      <p>{customer.tier}</p>
      <p>{customer.phone}</p>
      {customer.phone && (
        <div>
          <p>Barcode</p>
          <Barcode value={customer.phone} />
        </div>
      )}

      <p>Available Coupons</p>
      {availableCoupons.length > 0 ? (
        <ul>
          {availableCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onUseCoupon={handleUseCoupon}
            />
          ))}
        </ul>
      ) : (
        <p>There's no available coupon.</p>
      )}
    </div>
  );
}
