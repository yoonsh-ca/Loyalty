import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

export default function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/event');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events: ', error);
        setError('Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getFilteredEvents = () => {
    if (filterStatus === 'all') {
      return events;
    }
    return events.filter((event) =>
      event.status.includes(filterStatus.toUpperCase())
    );
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Events</h1>
      <div>
        <button
          onClick={() => setFilterStatus('all')}
          className={filterStatus === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('upcoming')}
          className={filterStatus === 'upcoming' ? 'active' : ''}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilterStatus('ongoing')}
          className={filterStatus === 'ongoing' ? 'active' : ''}
        >
          Ongoing
        </button>
        <button
          onClick={() => setFilterStatus('expired')}
          className={filterStatus === 'expired' ? 'active' : ''}
        >
          Expired
        </button>
      </div>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <p>No event data to show</p>
      )}
    </div>
  );
}
