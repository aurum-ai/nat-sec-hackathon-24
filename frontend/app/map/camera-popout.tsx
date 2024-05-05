'use client'

import { useEffect, useState } from 'react';
import styles from './camera-popout.module.scss';
import { TbCircleX } from "react-icons/tb";
import EventSummary, { Event } from '@/components/event-summary';
import { getAllActivity } from '../activity/actions';

export default function CameraPopout({ cameraId, onClose }: CameraPopout) {
  const [recentActivity, setRecentActivity] = useState<Event[]>([]);

  useEffect(() => {
    getAllActivity().then((activity) => {
      setRecentActivity(activity.filter(act => act.cameraId === cameraId).reverse());
    });
    const timer = setInterval(() => {
      getAllActivity().then((activity) => {
        setRecentActivity(activity.filter(act => act.cameraId === cameraId).reverse());
      });
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [cameraId]);

  const thumbnail = recentActivity?.[0]?.img;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.title}>Camera: {cameraId}</div>
        <button className={styles.closeButton} onClick={onClose}><TbCircleX /></button>
      </div>
      {thumbnail ? <img src={thumbnail} className={styles.videoContainer} /> : <div className={styles.videoContainer}></div>}
      <div className={styles.recentActivityTitle}>Recent Activity</div>
      {recentActivity.map(event => (
        <div key={event.id} className={styles.eventContainer}>
          <EventSummary event={event} />
        </div>
      ))}
      {recentActivity.length === 0 && <div>No recent activity</div>}
    </div>
  );
}

type CameraPopout = {
  cameraId: string;
  onClose: () => void;
};