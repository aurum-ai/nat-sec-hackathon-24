'use client'

import ReactMap, {
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  Layer,
  Source,
  MapLayerMouseEvent,
  MapRef,
  LngLatBoundsLike,
} from "react-map-gl";
import type { FeatureCollection, Feature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import styles from './map.module.scss';
import { Location } from './types';
import { LngLat, LngLatBounds } from 'mapbox-gl';

function getOuterBounds(locations: Location[]): LngLatBoundsLike {
  if (locations.length === 0) {
    return new LngLatBounds(new LngLat(-122.44, 37.77), new LngLat(-122.45, 37.78))
  }

  let maxLat = Number.MIN_SAFE_INTEGER;
  let maxLong = Number.MIN_SAFE_INTEGER;
  let minLat = Number.MAX_SAFE_INTEGER;
  let minLong = Number.MAX_SAFE_INTEGER;
  for (const location of locations) {
    if (location.lat > maxLat) {
      maxLat = location.lat;
    }
    if (location.long > maxLong) {
      maxLong = location.long;
    }
    if (location.lat < minLat) {
      minLat = location.lat;
    }
    if (location.long < minLong) {
      minLong = location.long;
    }
  }
  const sw = new LngLat(minLong, minLat);
  const ne = new LngLat(maxLong, maxLat);


  return new LngLatBounds(sw, ne);
}

export default function Map({ locations, onLocationClick }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      new ResizeObserver(() => {
        mapRef.current?.resize();
      }).observe(containerRef.current);
    }
  }, []);

  const initalView = {
    bounds: getOuterBounds(locations || [{ lat: 37.78, long: -122.45, id: '' }]),
    fitBoundsOptions: {
      padding: {
        left: 48, right: 48, top: 48, bottom: 48,
      },
    },
  };

  const features: Feature[] = locations?.map(({ long, lat, id }) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [long, lat],
    },
    properties: {
      id,
    },
  })) || [];

  const geoJson: FeatureCollection = {
    type: "FeatureCollection",
    features,
  };

  const onClick = ({ features }: MapLayerMouseEvent) => {
    const feature = features?.[0];
    if (feature?.properties?.id && onLocationClick) {
      onLocationClick(feature.properties.id);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <ReactMap
        ref={mapRef}
        mapLib={import("mapbox-gl")}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialViewState={initalView}
        style={{ width: "100%", height: "100%", borderRadius: 8 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        reuseMaps
        interactiveLayerIds={['locations']}
        onClick={onClick}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        <Source type="geojson" data={geoJson}>
          <Layer
            id="locations"
            type="circle"
            paint={{ "circle-radius": 5, "circle-color": "#ffc107", 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }}
          ></Layer>
        </Source>
      </ReactMap>
    </div>
  );
}

type MapProps = {
  locations?: Location[]
  onLocationClick?: (id: string) => void;
};