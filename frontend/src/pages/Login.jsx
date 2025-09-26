import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: call Baeck-end API
    try {
      const response = await axios.get('http://localhost:3001/api/customer', {
        params: {
          name: name,
          phone: phone,
        },
      });

      if (response.data.success) {
        login(response.data);
        navigate('/home');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login API Error: ', error);
      alert('Sorry, failed to log in. Please try again.');
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
