import { FC, useEffect } from "react";

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

const Map: FC<MapProps> = ({ onLocationError, onPOIProximity, pois }) => {
  useEffect(() => {
    // Mock implementation of user's current location
    const userLocation = [52.3676, 4.9041]; // Replace with actual location logic

    pois.forEach((poi) => {
      const distance = getDistance(userLocation, poi.coordinates);
      if (distance <= 20) {
        onPOIProximity(poi);
      }
    });
  }, [onPOIProximity, pois]);

  const getDistance = ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon1 - lon2) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres

    return distance;
  };

  return (
    <div>
      {/* Map rendering logic */}
    </div>
  );
};

export default Map;