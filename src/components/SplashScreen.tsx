import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface SplashScreenProps {
  onRouteSelect: (duration: number) => void;
}

const SplashScreen = ({ onRouteSelect }: SplashScreenProps) => {
  const [showPwaInstructions, setShowPwaInstructions] = useState(true);

  return (
    <div className="fixed inset-0 bg-white z-50 animate-fade-in">
      {showPwaInstructions ? (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-6 text-center">
          <h1 className="text-2xl font-bold text-navy-900">Welcome to Amsterdam Canal Tours</h1>
          <p className="text-navy-600">For the best experience, add this app to your home screen:</p>
          <div className="space-y-4 text-navy-500">
            <p>1. Tap the share button <span className="px-2 py-1 bg-gray-100 rounded">􀈂</span></p>
            <p>2. Select "Add to Home Screen"</p>
            <p>3. Tap "Add" to confirm</p>
          </div>
          <Button 
            className="mt-8"
            onClick={() => setShowPwaInstructions(false)}
          >
            Continue to App
          </Button>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
          <h2 className="text-2xl font-bold text-navy-900">Select Your Tour Duration</h2>
          <div className="grid gap-4 w-full max-w-sm">
            <Button 
              variant="outline" 
              className="h-16 text-lg justify-between px-6 hover:bg-water-50 hover:text-water-700 border-2"
              onClick={() => onRouteSelect(1)}
            >
              <span>1 Hour Classic</span>
              <Clock className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg justify-between px-6 opacity-50 cursor-not-allowed"
              disabled
            >
              <span>2 Hours (Coming Soon)</span>
              <Clock className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg justify-between px-6 opacity-50 cursor-not-allowed"
              disabled
            >
              <span>3 Hours (Coming Soon)</span>
              <Clock className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;