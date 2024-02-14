import Head from 'next/head';
import styles from "../styles/Home.module.css";
import Fuel from '@/components/fuel/fuel';
import mapboxgl from 'mapbox-gl';
import {useRef, useState, useEffect} from 'react';


export default function Home() {
  mapboxgl.accessToken = 'pk.eyJ1IjoidmFrb2x1cGFldiIsImEiOiJjbHNtNm43YmkwbWg5Mmtub3dwZmhlNHNtIn0.HxP3Kui65oh9_8JxfJrmZg';


  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/vakolupaev/clsm7618w01ro01qs7z6u1j65',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <>
      <Head>
        <title>FCC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.window}
      >
        <div
          className={styles.main}
        >
          <div id='map'>
            <div ref={mapContainer} className="map-container" />
          </div>
          <div className={styles.horizontal_section}>
            <Fuel />
            <Fuel />
            <Fuel />

          </div>
        </div>
        <div
          className={styles.vertical_section}
        >

        </div>
      </div>
    </>
  )
}
