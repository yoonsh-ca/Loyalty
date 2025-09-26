import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Barcode from 'react-barcode';
import CouponCard from '../components/CouponCard';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { customer, login } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomerData = useCallback(async () => {
    if (!customer?.phone_number || !customer?.name) return;

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/customer', {
        params: {
          name: customer.name,
          phone: customer.phone_number,
        },
      });
      if (response.data.success) {
        login(response.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Failed to refresh customer data: ', error);
      alert('Failed to bring the latest data of customer.');
    } finally {
      setLoading(false);
    }
  }, [customer, login]);

  // initial data listener
  useEffect(() => {
    if (customer && customer.coupons) {
      setCoupons(customer.coupons);
    }
  }, [customer]);

  const handleUseCoupon = async (couponId) => {
    console.log(`Home, Clicked the coupon use button: ${couponId}`);

    try {
      const pageId = customer.pageId;
      const response = await axios.post(
        'http://localhost:3001/api/coupon/update',
        {
          pageId: pageId,
          couponId: couponId,
        }
      );

      if (response.data.success) {
        alert('Coupon has used!');
        fetchCustomerData();
      } else {
        alert('Cannot use this coupon: ' + response.data.message);
      }
    } catch (error) {
      console.error('Failed to update coupon status: ' + error);
    }

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
        <Link to='/events'>Event</Link>
        <Link to='/sns'>Our SNS</Link>
        <Link to='/faq'>FAQ</Link>
      </div>
    );
  }

  const availableCoupons = coupons.filter((coupon) => {
    const today = new Date();
    const expiryDate = new Date(coupon.expiry_date);

    return !coupon.used && expiryDate >= today;
  });
  console.log(coupons, availableCoupons);

  return (
    <div>
      <Navbar />
      <h1>Hello, {customer.name}!</h1>
      <p>{customer.tier}</p>
      <p>{customer.phone_number}</p>
      {customer.phone_number && (
        <div>
          <p>Barcode</p>
          <Barcode value={customer.phone_number} />
        </div>
      )}

      <button onClick={fetchCustomerData}>
        {loading ? 'Refreshing...' : 'Refresh?'}
      </button>

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
