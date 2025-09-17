import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Barcode from 'react-barcode';

export default function Home() {
  const location = useLocation();
  const customer = location.state?.customer;

  if (customer) {
    const coupons = customer.coupons[0].coupons;
    const availableCoupons = coupons.filter((coupon) => !coupon.used);

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
              <li key={coupon.id}>
                <h3>{coupon.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p>There's no available coupon.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Welcom to K-town in Edmonton!</h1>
      <button>Event</button>
      <button>Location</button>
      <button>Instagram</button>
      <button>TikTok</button>
    </div>
  );
}
