
import React from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = React.useState(true); // Default to playing when tour starts
  const [currentPoiIndex, setCurrentPoiIndex] = React.useState(0);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback logic
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayback}
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Resume</span>
          </>
        )}
      </Button>
      <span className="text-sm text-navy-600">
        {currentPoiIndex + 1}/{pois.length} Stops
      </span>
    </div>
  );
};

export default Tour;
