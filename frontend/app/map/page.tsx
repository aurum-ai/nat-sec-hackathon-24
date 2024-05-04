'use client'

import MapComponent from '@/components/map';
import styles from './page.module.scss';
import { getPoints } from './actions';
import { useEffect, useState } from 'react';
import { Location } from '@/components/map/types';

export default function Map() {
  const [points, setPoints] = useState<Location[]>([]);

  useEffect(() => {
    getPoints().then((result) => {
      setPoints(result);
    });
  }, []);

  return (
    <div className={styles.container}>
      {points.length > 0 && <MapComponent locations={points} />}
    </div>
  );
}