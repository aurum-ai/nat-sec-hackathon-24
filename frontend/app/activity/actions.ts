'use server'

import { Event } from '@/components/event-summary';

export async function getAllActivity(): Promise<Event[]> {
  const result = await fetch('http://127.0.0.1:5000/alerts').then(res => res.json());

  return result.alerts.reduce((acc: Event[], alert: any) => {
    let found = []
    for (const key of Object.keys(alert.type)) {
      if (alert.type[key]) {
        found.push(key)
      }
    }

    // console.log(alert);

    if (found.length) {
      acc.push({
        id: String(alert.id),
        cameraId: String(alert.feedId),
        img: alert.thumbnail,
        timestamp: alert.datetime,
        description: `Found: ${found.join(", ")}`,
      });
    }
    return acc;
  }, []);
}