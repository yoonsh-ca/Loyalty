import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Benefit() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(benefits);
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/benefit');
        setBenefits(response.data);
      } catch (error) {
        console.error('Failed to fetch benefits data: ', error);
        setError('Failed to benefits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  if (loading) {
    return <div>Loading benefits data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div>
        <h1>Benefits by Tier</h1>
        {benefits.length > 0 ? (
          benefits.map((tier) => (
            <div key={tier.id}>
              <h2>{tier.tier}</h2>
              <p>
                Minimum spending amount: ${tier.min_spending.toLocaleString()}
              </p>
              <ul>
                {tier.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>There is no data to show.</p>
        )}
      </div>
    </div>
  );
}
