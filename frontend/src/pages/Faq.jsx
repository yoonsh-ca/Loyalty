import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/faq');
        if (Array.isArray(response.data)) {
          setFaqs(response.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleToggle = (id) => {
    setFaqs(
      faqs.map((faq) => (faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq))
    );
  };

  const getFaqAnswer = (answer) => {
    const answerWithBreaks = answer.replace(/\n/g, '<br>');
    return { __html: answerWithBreaks };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>FAQ</h2>
      <div>
        {faqs.map((faq) => (
          <div key={faq.id} className={`${faq.isOpen ? 'open' : ''}`}>
            <div className='faq-question' onClick={() => handleToggle(faq.id)}>
              {faq.question}
            </div>
            <div
              className={`${faq.isOpen ? 'show' : ''}`}
              dangerouslySetInnerHTML={getFaqAnswer(faq.answer)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
