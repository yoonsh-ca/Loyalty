import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
              expiryDate: '2025-01-31',
            },
            {
              id: 18932339,
              name: '무료 배송 쿠폰',
              used: false,
              expiryDate: '2025-08-30',
            },
          ],
        },
      ],
    };

    if (name === fakeCustomerData.name && phone === fakeCustomerData.phone) {
      login(fakeCustomerData);
      navigate('/home');
    } else {
      alert('There is no entered data');
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
