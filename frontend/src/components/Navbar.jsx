import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ customer, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav>
      {/* TODO: Add pop-up? dropdown menu feat, and change to hamburger icon */}
      {customer && (
        <div>
          <Link to={'/benefits'}>Benefits</Link>
          <Link to={'/events'}>Events</Link>
          <Link to={'/location'}>Location</Link>
          <Link to={'/sns'}>SNS</Link>
          <Link to={'/faq'}>FAQ</Link>
        </div>
      )}

      {/* TODO: Change to K-Town logo */}
      <div>
        <Link to='/home'>K-Town</Link>
      </div>

      <div>
        {customer ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <Link to='/'>Log In</Link>
        )}
      </div>
    </nav>
  );
}
