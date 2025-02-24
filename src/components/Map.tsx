
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface POI {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  audioUrl: string;
}

interface MapProps {
  onLocationError: () => void;
  onPOIProximity: (poi: POI) => void;
  pois: POI[];
}

const Map = ({ onLocationError, onPOIProximity, pois }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with your custom style
    mapboxgl.accessToken = "pk.eyJ1Ijoic3RlZWZuZWVmIiwiYSI6ImNtNXF2djk4dTAzcjQybnM4YXk3cXEyNjEifQ.M4_2E4ylBSyOddvKalMxkw";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/steefneef/cm7by9zjy007o01s788kl19l7",
      center: [4.885119, 52.374495], // Centered on Amsterdam canal route
      zoom: 15,
      pitch: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    // Add the route when the style is loaded
    map.current.on('style.load', () => {
      if (!map.current) return;

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [4.887611835704689, 52.37964142905949],
              [4.883177010693288, 52.37489809419134],
              [4.882443981766414, 52.36664079139621],
              [4.882883799122766, 52.36608129770255],
              [4.884899628673111, 52.36686458688985],
              [4.884533114209091, 52.367312174475444],
              [4.884826325780779, 52.371317881447936],
              [4.885119537351244, 52.374495334746],
              [4.887941698723154, 52.377560689228176],
              [4.889847573934361, 52.37975329401476],
              [4.888491470418558, 52.38040210516846],
              [4.887575184259134, 52.37961905603416]
            ]
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#1482FF',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      // Add POI markers
      const poiCoordinates = [
        { name: "Keizergracht naar Brouwers", coordinates: [4.889843100194469, 52.37974977474141] },
        { name: "Noorderkerk", coordinates: [4.887454684643103, 52.379487162752895] },
        { name: "Huis met Den Hoofden", coordinates: [4.886981607172686, 52.376467393423354] },
        { name: "Anne Frank Huis", coordinates: [4.8838016826306045, 52.37553316857546] },
        { name: "Westerkerk", coordinates: [4.883060408403026, 52.37458759069162] }
      ];

      poiCoordinates.forEach((poi) => {
        const marker = new mapboxgl.Marker({
          color: '#1482FF'
        })
          .setLngLat(poi.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="font-semibold">${poi.name}</h3>
          `))
          .addTo(map.current!);
      });

      map.current.resize();
    });

    // Watch user location
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(newLocation);
          
          // Check POIs near user location
          pois.forEach(poi => {
            const distance = calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              poi.coordinates[1],
              poi.coordinates[0]
            );

            if (distance <= 0.02) { // 20 meters
              onPOIProximity(poi);
            }
          });
        },
        (error) => {
          console.error("Location error:", error);
          onLocationError();
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, [onLocationError, onPOIProximity, pois]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Map;
