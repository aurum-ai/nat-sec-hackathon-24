import styles from './event-summary.module.scss';
import Link from 'next/link';

export type Event = {
  id: string;
  cameraId: string;
  img: string;
  timestamp: string;
  description: string;
};

export default function EventSummary({ event }: EventSummaryProps) {
  return (
    <Link href={`/activity/${event.id}`} className={styles.container}>
      <span>{event.description}</span>
      <span>{event.timestamp}</span>
    </Link>
  );
}

type EventSummaryProps = {
  event: Event;
};