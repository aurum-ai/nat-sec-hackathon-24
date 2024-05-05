'use server'

import { Location } from '@/components/map/types';

export async function getPoints(): Promise<Location[]> {
  const result = await fetch('http://127.0.0.1:5000/feeds').then(res => res.json());

  return result.feeds.map((feed: any) => (
    { id: String(feed.id), lat: feed.coordinates.latitude, long: feed.coordinates.longitude }
  ));
  // return Promise.resolve([
  //   { lat: 37.79574254137265, long: -122.39681670876371, id: "abc" },
  //   { lat: 37.80415652514376, long: -122.42531986711975, id: "def" },
  //   { lat: 37.809735407196655, long: -122.47741083172258, id: "ghj" },
  //   { lat: 37.76965044702114, long: -122.4657947805919, id: "ijk" },
  //   { lat: 37.771214813834845, long: -122.43705580783597, id: "lmn" },
  // ]);
};