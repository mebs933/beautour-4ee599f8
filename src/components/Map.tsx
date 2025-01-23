import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  onLocationError: () => void;
}

const Map = ({ onLocationError }: MapProps) => {
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
      center: [4.9041, 52.3676], // Amsterdam coordinates
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocate, "top-right");

    // Attempt to get user location on load
    map.current.on('load', () => {
      geolocate.trigger();
    });

    // Load and add POIs from localStorage
    const savedPois = localStorage.getItem("pois");
    if (savedPois) {
      const pois = JSON.parse(savedPois);
      pois.forEach((poi: any) => {
        const marker = new mapboxgl.Marker()
          .setLngLat(poi.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="font-semibold">${poi.name}</h3>
            <p>${poi.description}</p>
          `))
          .addTo(map.current!);
      });
    }

    // Watch user location
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(newLocation);
          console.log("Updated user location:", newLocation);
          checkNearbyPOIs(position.coords);
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
  }, [onLocationError]);

  const checkNearbyPOIs = (coords: GeolocationCoordinates) => {
    const savedPois = localStorage.getItem("pois");
    if (!savedPois) return;

    const pois = JSON.parse(savedPois);
    pois.forEach((poi: any) => {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        poi.coordinates[0],
        poi.coordinates[1]
      );

      if (distance <= 0.02) { // 20 meters
        console.log("Near POI:", poi.name);
        // TODO: Trigger audio playback and show overlay
      }
    });
  };

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
