import { useState } from "react";
import Map from "@/components/Map";
import RouteOverview from "@/components/RouteOverview";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isRouteVisible, setIsRouteVisible] = useState(true);

  // Temporary function to show toast when GPS is not available
  const handleLocationError = () => {
    toast({
      title: "Location Access Required",
      description: "Please enable location services to use navigation features.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative h-screen w-full bg-navy-50">
      <Map onLocationError={handleLocationError} />
      <RouteOverview 
        isVisible={isRouteVisible}
        onClose={() => setIsRouteVisible(false)}
      />
    </div>
  );
};

export default Index;