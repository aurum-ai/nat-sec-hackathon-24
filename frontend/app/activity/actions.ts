import { Event } from '@/components/event-summary';

export async function getAllActivity(): Promise<Event[]> {
  return Promise.resolve([
    { id: "123", cameraId: "abc", img: "", timestamp: "5 minutes ago", description: "Explosion detected" },
    { id: "456", cameraId: "abc", img: "", timestamp: "5 minutes ago", description: "Tank detected" },
    { id: "789", cameraId: "def", img: "", timestamp: "5 minutes ago", description: "Tank detected" },
    { id: "101112", cameraId: "abc", img: "", timestamp: "5 minutes ago", description: "Tank detected" },
    { id: "131415", cameraId: "ghi", img: "", timestamp: "5 minutes ago", description: "Tank detected" },
  ]);
}