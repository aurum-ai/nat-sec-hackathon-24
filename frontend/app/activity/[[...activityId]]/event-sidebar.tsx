import styles from './event.module.scss';
import { Event } from '@/components/event-summary';
import { TbCircleX } from "react-icons/tb";

export default function EventSidebar({ event, onClose }: EventSidebarProps) {
  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={onClose}><TbCircleX /></button>
      {event.img ? <img src={event.img} className={styles.thumbnail} /> : <div className={styles.thumbnail}></div>}
    </div>
  );
}

type EventSidebarProps = {
  event: Event;
  onClose: () => void;
};