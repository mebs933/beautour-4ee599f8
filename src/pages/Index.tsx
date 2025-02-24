
import { useState, useEffect } from "react";
import Map from "@/components/Map";
import RouteOverview from "@/components/RouteOverview";
import SplashScreen from "@/components/SplashScreen";
import { useToast } from "@/hooks/use-toast";
import Tour from "@/components/Tour";
import POIInfoCard from "@/components/POIInfoCard";
import poisData from "@/data/pois.json";

interface POI {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  audioUrl: string;
}

const Index = () => {
  const { toast } = useToast();
  const [showSplash, setShowSplash] = useState(true);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [pois, setPois] = useState<POI[]>([]);
  const [currentPOI, setCurrentPOI] = useState<POI | null>(null);

  useEffect(() => {
    // Load POIs from JSON file and ensure coordinates are properly typed
    const typedPois = poisData.map(poi => ({
      ...poi,
      coordinates: poi.coordinates as [number, number]
    }));
    setPois(typedPois);
  }, []);

  const handleRouteSelect = (duration: number) => {
    setShowSplash(false);
    setIsRouteVisible(false); // Start with route hidden to focus on map
    toast({
      title: "Route Selected",
      description: `${duration} hour classic canal tour loaded. Swipe up to see route details.`,
    });
  };

  const handleLocationError = () => {
    toast({
      title: "Location Access Required",
      description: "Please enable location services to use navigation features.",
      variant: "destructive",
    });
  };

  const handlePOIProximity = (poi: POI) => {
    setCurrentPOI(poi);
  };

  const handleCloseInfoCard = () => {
    setCurrentPOI(null);
  };

  return (
    <div className="relative h-screen w-full bg-navy-50">
      {showSplash && <SplashScreen onRouteSelect={handleRouteSelect} />}
      <Map onLocationError={handleLocationError} onPOIProximity={handlePOIProximity} pois={pois} />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <button
          onClick={() => setIsRouteVisible(!isRouteVisible)}
          className="text-sm text-navy-600"
        >
          {isRouteVisible ? "Hide Route Details" : "Show Route Details"}
        </button>
      </div>
      <RouteOverview
        isVisible={isRouteVisible}
        onClose={() => setIsRouteVisible(false)}
      />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <Tour pois={pois} />
      </div>
      {currentPOI && (
        <POIInfoCard poi={currentPOI} onClose={handleCloseInfoCard} />
      )}
    </div>
  );
};

export default Index;
