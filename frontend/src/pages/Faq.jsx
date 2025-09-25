import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(faqs);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/faq');
        setFaqs(response.data);
      } catch (error) {
        console.error('Failed to fetch FAQs: ', error);
        setError('Failed to fetch FAQs data');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return <div>Getting FAQ data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>FAQ</h1>
      {faqs.length > 0 ? (
        faqs.map((faq) => (
          <div key={faq.id}>
            <h2>Q: {faq.question}</h2>
            <p>A: {faq.answer}</p>
          </div>
        ))
      ) : (
        <p>There's no FAQ data.</p>
      )}
    </div>
  );
}
