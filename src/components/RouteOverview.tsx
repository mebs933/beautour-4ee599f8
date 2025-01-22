import { MapPin } from "lucide-react";

interface RouteOverviewProps {
  isVisible: boolean;
  onClose: () => void;
}

const RouteOverview = ({ isVisible, onClose }: RouteOverviewProps) => {
  const points = [
    { name: "Central Station", time: "0 min" },
    { name: "Anne Frank House", time: "10 min" },
    { name: "Rijksmuseum", time: "25 min" },
    { name: "Vondelpark", time: "35 min" },
    { name: "Royal Palace", time: "45 min" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="p-4">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-navy-900 mb-4">Classic Canal Tour</h2>
        <div className="space-y-6">
          {points.map((point, index) => (
            <div key={index} className="flex items-center">
              <div className="relative">
                <MapPin className="h-6 w-6 text-water-600" />
                {index < points.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-0.5 h-6 bg-water-200 -translate-x-1/2" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-navy-900 font-medium">{point.name}</p>
                <p className="text-sm text-navy-500">{point.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteOverview;