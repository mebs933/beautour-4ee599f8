import { useState } from "react";
import Map from "@/components/Map";
import RouteOverview from "@/components/RouteOverview";
import SplashScreen from "@/components/SplashScreen";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [showSplash, setShowSplash] = useState(true);
  const [isRouteVisible, setIsRouteVisible] = useState(false);

  const handleRouteSelect = (duration: number) => {
    setShowSplash(false);
    setIsRouteVisible(true);
    toast({
      title: "Route Selected",
      description: `${duration} hour classic canal tour loaded`,
    });
  };

  const handleLocationError = () => {
    toast({
      title: "Location Access Required",
      description: "Please enable location services to use navigation features.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative h-screen w-full bg-navy-50">
      {showSplash && <SplashScreen onRouteSelect={handleRouteSelect} />}
      <Map onLocationError={handleLocationError} />
      <RouteOverview 
        isVisible={isRouteVisible}
        onClose={() => setIsRouteVisible(false)}
      />
    </div>
  );
};

export default Index;