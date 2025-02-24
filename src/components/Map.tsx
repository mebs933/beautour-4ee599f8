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

    // Initialize map with hardcoded token
    mapboxgl.accessToken = "pk.eyJ1IjoibWVsYmF0b2FzdGplIiwiYSI6ImNtMzY1YjBkcjAxbmwyanF3c3oxeGRyYXYifQ.-MBdEjL8673RmCLjZ2MXMQ";
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [4.9041, 52.3676] as [number, number], // Amsterdam coordinates
      zoom: 13,
      pitch: 0, // Ensure flat view
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    map.current.on('style.load', () => {
      map.current?.resize();
    });

    // Load and add POIs
    pois.forEach((poi) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(poi.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3 class="font-semibold">${poi.name}</h3>
          <p>${poi.description}</p>
        `))
        .addTo(map.current!);
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
