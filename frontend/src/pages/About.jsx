import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

export default function About() {
  const { customer, logout } = useContext(AuthContext);
  return (
    <div>
      <Navbar customer={customer} onLougout={logout} />
      <h1>K-Town</h1>
      <p>K-Town Introduction</p>
    </div>
  );
}
