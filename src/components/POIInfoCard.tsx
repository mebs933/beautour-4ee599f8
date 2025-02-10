import { FC, useEffect, useRef } from "react";

interface POI {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  audioUrl: string;
}

interface POIInfoCardProps {
  poi: POI;
  onClose: () => void;
}

const POIInfoCard: FC<POIInfoCardProps> = ({ poi, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [poi]);

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 bg-white p-4 rounded-t-lg shadow-lg z-10">
      <h2 className="text-xl font-bold mb-2">{poi.name}</h2>
      <p className="text-gray-700 mb-2">{poi.description}</p>
      {poi.audioUrl && (
        <audio ref={audioRef} controls src={poi.audioUrl} className="w-full mb-2">
          Your browser does not support the audio element.
        </audio>
      )}
      <button onClick={onClose} className="text-blue-500">
        Close
      </button>
    </div>
  );
};

export default POIInfoCard;