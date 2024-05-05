import styles from './event-summary.module.scss';

export type Event = {
  id: string;
  cameraId: string;
  img: string;
  timestamp: string;
  description: string;
};

export default function EventSummary({ event, onClick }: EventSummaryProps) {
  const click = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div className={styles.container} onClick={click}>
      <span>{event.description}</span>
      <span>{event.timestamp}</span>
    </div>
  );
}

type EventSummaryProps = {
  event: Event;
  onClick?: (event: Event) => {};
};