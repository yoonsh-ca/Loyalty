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
      <div>Menu</div>

      {/* TODO: Change to K-Town logo */}
      <div>
        <Link to='/'>K-Town</Link>
      </div>

      <div>
        {customer ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <button>
            <Link to='/'>Log In</Link>
          </button>
        )}
      </div>
    </nav>
  );
}
