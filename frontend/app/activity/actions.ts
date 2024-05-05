'use server'

import { Event } from '@/components/event-summary';

export async function getAllActivity(): Promise<Event[]> {
  const result = await fetch('http://127.0.0.1:5000/alerts').then(res => res.json());

  return result.alerts.map((alert: any) => ({
    id: String(alert.id),
    cameraId: alert.feedId,
    img: alert.thumbnail,
    timestamp: alert.datetime,
    description: alert.description,
  }));
}