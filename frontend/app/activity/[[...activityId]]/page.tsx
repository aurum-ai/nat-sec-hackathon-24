'use client'

import { useEffect, useState } from "react";
import EventSummary, { Event } from '@/components/event-summary';
import styles from './activity.module.scss';
import { getAllActivity } from "../actions";

export default function Activity() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getAllActivity().then(result => {
      setEvents(result);
    })
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Activity</h1>
      {events.map(event => (
        <div key={event.id} className={styles.eventContainer}>
          <EventSummary event={event} />
        </div>
      ))}
    </div>
  );
}