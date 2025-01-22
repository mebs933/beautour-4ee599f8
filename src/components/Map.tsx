import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  onLocationError: () => void;
}

const Map = ({ onLocationError }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN"; // Replace with your token
    
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

    // Attempt to get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location acquired:", position);
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

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Map;