import React from 'react';
import Navbar from '../components/Navbar';

export default function Sns() {
  return (
    <div>
      <Navbar />
      <h1>K-Town SNS</h1>
      <p>Follow our SNS account, and receive various news!</p>
      <div>
        <a href='https://www.kplaytown.ca'>
          <span>K-Town</span>
        </a>
      </div>
      <div>
        <a href='https://www.instagram.com/ktown_edmonton'>
          <span>Instagram</span>
        </a>
      </div>
      <div>
        <a href='https://www.tiktok.com/@ktownsgm'>
          <span>TikTok</span>
        </a>
      </div>
    </div>
  );
}
