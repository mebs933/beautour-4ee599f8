
import { useState, useEffect } from "react";
import Map from "@/components/Map";
import RouteOverview from "@/components/RouteOverview";
import SplashScreen from "@/components/SplashScreen";
import { useToast } from "@/hooks/use-toast";
import Tour from "@/components/Tour";
import POIInfoCard from "@/components/POIInfoCard";
import poisData from "@/data/pois.json";
import { ChevronUp, ChevronDown } from "lucide-react";

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
    const typedPois = poisData.map(poi => ({
      ...poi,
      coordinates: poi.coordinates as [number, number]
    }));
    setPois(typedPois);
  }, []);

  const handleRouteSelect = (duration: number) => {
    setShowSplash(false);
    setIsRouteVisible(false);
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
      
      {/* Centered bottom controls with gradient backdrop */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center gap-4">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          {/* Route Details Button */}
          <button
            onClick={() => setIsRouteVisible(!isRouteVisible)}
            className="group flex items-center gap-2 bg-white/95 hover:bg-[#1482FF] text-navy-600 hover:text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            {isRouteVisible ? (
              <>
                Hide Route Details
                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
              </>
            ) : (
              <>
                Show Route Details
                <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
          
          {/* Tour Progress Indicator */}
          <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
            <Tour pois={pois} />
          </div>
        </div>
      </div>

      <RouteOverview
        isVisible={isRouteVisible}
        onClose={() => setIsRouteVisible(false)}
      />
      
      {currentPOI && (
        <POIInfoCard poi={currentPOI} onClose={handleCloseInfoCard} />
      )}
    </div>
  );
};

export default Index;
