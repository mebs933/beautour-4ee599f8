
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface POI {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  audioUrl: string;
}

interface TourProps {
  pois: POI[];
}

const Tour = ({ pois }: TourProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback logic
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePlayback}
      className="flex items-center gap-2"
    >
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4" />
          <span>Pause Tour</span>
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          <span>Start Tour</span>
        </>
      )}
    </Button>
  );
};

export default Tour;
