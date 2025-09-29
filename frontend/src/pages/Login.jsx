import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const normalizePhone = (input) => {
    const numericValue = input.replace(/\D/g, '');
    return numericValue.startsWith('1') ? numericValue : `1${numericValue}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const normalizedPhone = normalizePhone(phone);

      const response = await axios.get('http://localhost:3001/api/customer', {
        params: {
          name: name,
          phone: normalizedPhone,
        },
      });

      if (response.data.success) {
        login(response.data);
        navigate('/home');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Login API Error: ', error);
      setErrorMessage('Sorry, failed to log in. Please try again.');
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
            placeholder='Phone Number (e.g., 5871231234)'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Verify</button>
      </form>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
    </div>
  );
}
