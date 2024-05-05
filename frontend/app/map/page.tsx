'use client'

import MapComponent from '@/components/map';
import styles from './page.module.scss';
import { getPoints } from './actions';
import { useEffect, useState } from 'react';
import { Location } from '@/components/map/types';
import CameraPopout from './camera-popout';

export default function Map() {
  const [points, setPoints] = useState<Location[]>([]);
  const [displayedCamera, setDisplayedCamera] = useState<string | undefined>();

  useEffect(() => {
    getPoints().then((result) => {
      setPoints(result);
    });
  }, []);

  const openCamera = (locationId: string) => {
    const point = points.find(point => point.id = locationId);
    if (point) {
      setDisplayedCamera(point.id);
    }
  };

  const closePopout = () => {
    setDisplayedCamera(undefined);
  }

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        {points.length > 0 && <MapComponent locations={points} onLocationClick={openCamera} />}
      </div>
      {displayedCamera && <CameraPopout cameraId={displayedCamera} onClose={closePopout} />}
    </div>
  );
}