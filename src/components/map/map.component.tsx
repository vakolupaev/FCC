/* eslint-disable @next/next/no-img-element */
import { MapboxOverlay } from '@deck.gl/mapbox';
import { DeckProps } from '@deck.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { OBJLoader } from '@loaders.gl/obj';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useEffect, useState } from 'react';
import useMapStore from './store/map.store';
import { Button } from '@nextui-org/react';
import { Map, useControl, Marker } from 'react-map-gl';
import useDragula from '@/crafts/UAV/DRAGULA/dragula';
import { PathLayer } from 'deck.gl';

function DeckGLOverlay(props: DeckProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

type BartLine = {
    name: string;
    color: string;
    path: [longitude: number, latitude: number][];
};

const MapComponent = () => {
    const store: any = useMapStore();
    const { lat, lon, zoom, setZoom, setLat, setLon } = store;
    const [markers, setMarkers] = useState<any[]>([]);
    const [acceptMarkerCreation, setAcceptMarkerCreation] = useState(true);
    const dragula = useDragula();

    const layers = [
        new SimpleMeshLayer({
            id: 'SimpleMeshLayer',
            data: [{ "name": "Lafayette (LAFY)", "code": "LF", "address": "3601 Deer Hill Road, Lafayette CA 94549", "entries": "3481", "exits": "3616", "coordinates": [-122.123801, 37.893394, 0] }],

            getColor: [0, 200, 255],
            getOrientation: [dragula.orientation[0], dragula.orientation[1], dragula.orientation[2]],
            getPosition: [dragula.lon, dragula.lat, dragula.alt / 1000],
            getTranslation: [0, 0, 0],
            mesh: 'CargoPlane.obj',
            sizeScale: 0.01,
            loaders: [OBJLoader],
            // opacity: 0.1,
            pickable: true,
        }),
        new PathLayer<BartLine>({
            id: 'PathLayer',
            data: dragula.track,

            getColor: [255, 100, 100],
            getPath: (d: BartLine) => d.path,
            getWidth: 4,
            pickable: true
        })
    ];

    const [style, setStyle] = useState(false);

    useEffect(() => {
        console.log(dragula.track);
    }, [dragula.track])

    return (
        <>
            <Map
                style={{ borderRadius: '18px' }}
                initialViewState={{ longitude: lon, latitude: lat, zoom: zoom }}
                mapStyle={style ? "mapbox://styles/vakolupaev/clv05nnkt006g01qp2ymu7g2k" : "mapbox://styles/vakolupaev/clv0rfx5a007i01pkf9mp6e2r"}
                mapboxAccessToken="pk.eyJ1IjoidmFrb2x1cGFldiIsImEiOiJjbHNtNm43YmkwbWg5Mmtub3dwZmhlNHNtIn0.HxP3Kui65oh9_8JxfJrmZg"

                onMove={(e) => {
                    const cent = e.target.getCenter();
                    const zoom = e.target.getZoom();
                    setLat(cent.lat);
                    setLon(cent.lng);
                    setZoom(zoom);
                }}

                onClick={(e) => {
                    if (acceptMarkerCreation) {
                        const marker = { id: JSON.stringify(e.lngLat) + 1, lon: e.lngLat.lng, lat: e.lngLat.lat, color: 'red' }
                        setMarkers((prev) => [...prev, marker])
                    }
                }}


            >
                <DeckGLOverlay layers={layers} />

                {
                    markers.map((marker, index) => <Marker
                        key={marker.id}
                        latitude={marker.lat}
                        longitude={marker.lon}
                        onClick={(e) => {
                            setAcceptMarkerCreation(false);
                            setTimeout(() => {
                                setAcceptMarkerCreation(true)
                            }, 100)
                            setMarkers((prev) => prev.filter((mark) => mark.id != marker.id))
                        }}
                    />)
                }

                {
                    <Button
                        onClick={() => setStyle(!style)}
                        radius="md"
                        size="lg"
                        isIconOnly
                        className=' absolute top-2 left-2 z-30 bg-[#1a1a1a]'
                    >
                        <div className='h-7 w-7 flex justify-center items-center'>
                            <img src='/layers.png' alt='icon' className='absolute invert h-7' />
                            <img src='/layers.png' alt='icon' className='absolute invert h-7 blur-sm' />
                        </div>

                    </Button>
                }
            </Map >
        </>
    )
}

export default MapComponent;
