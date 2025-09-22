import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Barcode from 'react-barcode';
import CouponCard from '../components/CouponCard';

export default function Home() {
  const location = useLocation();
  const [customer, setCustomer] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  // initial data listener
  useEffect(() => {
    if (location.state?.customer) {
      setCustomer(location.state.customer);
      const initialCoupons = location.state.customer.coupons[0].coupons;
      setCoupons(initialCoupons);
    }
  }, [location.state]);

  const handleLogout = () => {
    setCustomer(null);
    sessionStorage.removeItem('customer');
    navigate('/');
  };

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
        <Navbar customer={customer} onLogout={handleLogout} />
        <h1>Welcom to K-town in Edmonton!</h1>
        <button>Event</button>
        <button>Location</button>
        <button>Instagram</button>
        <button>TikTok</button>
      </div>
    );
  }

  const availableCoupons = coupons.filter((coupon) => !coupon.used);

  return (
    <div>
      <Navbar customer={customer} onLogout={handleLogout} />
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
