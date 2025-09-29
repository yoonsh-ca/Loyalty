import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Error() {
  const location = useLocation();
  const errorMessage =
    location.state?.message || 'An unexpected error occurred.';

  return (
    <div>
      <div>
        <h1>Oops!</h1>
        <p>{errorMessage}</p>
        <Link to='/home'>Go to Main</Link>
      </div>
    </div>
  );
}
