import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The address you entered does not exist, or the requested page has been
        moved or deleted.
      </p>
      <Link to='/home'>Go to Main</Link>
    </div>
  );
}
