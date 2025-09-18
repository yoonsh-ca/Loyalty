import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: call Baeck-end API

    // Dummy Data
    const fakeCustomerData = {
      name: 'Seonhye',
      phone: '5875784932',
      tier: 'Employee',
      barcode: '5875784932',
      coupons: [
        {
          coupons: [
            {
              id: 19482058,
              name: '10% 할인 쿠폰',
              used: false,
              expiry_date: '2025-12-31',
            },
            {
              id: 18932339,
              name: '무료 배송 쿠폰',
              used: true,
              expiry_date: '2025-11-30',
            },
          ],
        },
      ],
    };

    const isCustomerFound = true;

    if (isCustomerFound) {
      console.log('Success to look up customer data!');
      navigate('/home', { state: { customer: fakeCustomerData } });
    } else {
      console.log(`No data`);
      navigate('/');
      alert(`There's no entered data`);
    }
  };

  return (
    <div className='login'>
      <h1>K-Town Customer Loyalty</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>First Name</label>
          <input
            type='text'
            id='name'
            placeholder='First Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='phone'>Phone Number</label>
          <input
            type='tel'
            id='phone'
            placeholder='Phone Number(without - and space)'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Verify</button>
      </form>
    </div>
  );
}
