'use client'
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Geolocation from 'ol/Geolocation';

const MapComponent = ({ mapUrl1, mapUrl2 }: { mapUrl1: string; mapUrl2: string }) => {
  const mapRef = useRef<Map | null>(null);
  const layerRef1 = useRef<any | null>(null);
  const layerRef2 = useRef<any | null>(null);
  const [userZoomedOut, setUserZoomedOut] = useState(false);
  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: 'map',
        layers: [],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    }

    // If the layer references already exist, remove them
    if (layerRef1.current) {
      mapRef.current.removeLayer(layerRef1.current);
    }
    if (layerRef2.current) {
      mapRef.current.removeLayer(layerRef2.current);
    }

    // Create and add the new layers
     if (mapUrl2) {
      layerRef2.current = new TileLayer({
        source: new XYZ({
          url: mapUrl2,
        }),
      });
      if (mapUrl1) {
      layerRef1.current = new TileLayer({
        source: new XYZ({
          url: mapUrl1,
        }),
      });
      mapRef.current.addLayer(layerRef1.current);
    }
   
      mapRef.current.addLayer(layerRef2.current);
    }

    // Get the user's geolocation and focus the map on that location
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: mapRef.current.getView().getProjection(),
    });
    geolocation.setTracking(true);
    geolocation.on('change:position', () => {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        const extent = [coordinates[0] - 5000, coordinates[1] - 5000, coordinates[0] + 5000, coordinates[1] + 5000];
        if(mapRef.current && !userZoomedOut){
          mapRef.current.getView().fit(extent);
        }
      }
    });
    console.log(geolocation)
    // Prevent automatic zooming back in if user manually zoomed out
    mapRef.current.on('moveend', () => {
      setUserZoomedOut(false);
    });

  }, [mapUrl1, mapUrl2, userZoomedOut]);

  // Function to handle user zooming out manually
  const handleZoomOut = () => {
    setUserZoomedOut(true);
  };

  return (
    <div id="map" style={{ width: '100%', height: '800px' }} onWheel={handleZoomOut}></div>
  );
};

export default MapComponent;
