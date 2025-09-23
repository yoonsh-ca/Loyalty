import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { customer, logout } = useContext(AuthContext);

  return (
    <nav>
      {/* TODO: Add pop-up? dropdown menu feat, and change to hamburger icon */}
      {customer && (
        <div>
          <Link to='/about'>About Us</Link>
          <Link to='/benefits'>Benefits</Link>
          <Link to='/events'>Events</Link>
          <Link to='/sns'>SNS</Link>
          <Link to='/faq'>FAQ</Link>
        </div>
      )}

      {/* TODO: Change to K-Town logo */}
      <div>
        <Link to='/home'>K-Town</Link>
      </div>

      <div>
        {customer ? (
          <button onClick={logout}>Log Out</button>
        ) : (
          <Link to='/'>Log In</Link>
        )}
      </div>
    </nav>
  );
}
