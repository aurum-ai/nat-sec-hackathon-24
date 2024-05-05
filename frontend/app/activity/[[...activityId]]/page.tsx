'use client'

import { useEffect, useState } from "react";
import EventSummary, { Event } from '@/components/event-summary';
import styles from './activity.module.scss';
import { getAllActivity } from "../actions";
import EventSidebar from "./event-sidebar";
import { useRouter } from "next/navigation";

export default function Activity({ params }: ActivityProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const activeEvent = params.activityId?.length ? events.find(event => event.id === (params.activityId?.[0])) : undefined;

  useEffect(() => {
    getAllActivity().then(result => {
      setEvents(result);
    });
    const timer = setInterval(() => {
      getAllActivity().then(result => {
        setEvents(result);
      });
    }, 1000);
  }, []);

  const closeActiveEvent = () => {
    router.push('/activity');
  }

  return (
    <div className={styles.container}>
      <div className={styles.activityContainer}>
        <h1 className={styles.title}>All Activity</h1>
        {events.map(event => (
          <div key={event.id} className={`${styles.eventContainer} ${event.id === activeEvent?.id ? styles.activeEvent : ''}`}>
            <EventSummary event={event} />
          </div>
        ))}
      </div>
      {activeEvent && <EventSidebar event={activeEvent} onClose={closeActiveEvent} />}
    </div>
  );
}

type ActivityProps = {
  params: { activityId?: string[] };
};