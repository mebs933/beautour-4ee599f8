
import React from "react";

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
  const [currentPoiIndex, setCurrentPoiIndex] = React.useState(0);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-navy-600">
        Stop {currentPoiIndex + 1} of {pois.length}
      </span>
    </div>
  );
};

export default Tour;
