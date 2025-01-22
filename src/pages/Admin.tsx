import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface POI {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  audioUrl: string;
}

const Admin = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [pois, setPois] = useState<POI[]>([]);
  const [newPoi, setNewPoi] = useState<Partial<POI>>({});

  const handleSaveMapboxToken = () => {
    localStorage.setItem("mapbox_token", mapboxToken);
    toast({
      title: "Success",
      description: "Mapbox token saved successfully",
    });
  };

  const handleAddPoi = () => {
    if (!newPoi.name || !newPoi.coordinates || !newPoi.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const poi: POI = {
      id: Date.now().toString(),
      name: newPoi.name,
      coordinates: newPoi.coordinates,
      description: newPoi.description,
      audioUrl: newPoi.audioUrl || "",
    };

    setPois([...pois, poi]);
    setNewPoi({});
    localStorage.setItem("pois", JSON.stringify([...pois, poi]));
    
    toast({
      title: "Success",
      description: "POI added successfully",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="space-y-4 p-6 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Mapbox Configuration</h2>
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Mapbox Token</Label>
          <Input
            id="mapbox-token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox token"
          />
          <Button onClick={handleSaveMapboxToken}>Save Token</Button>
        </div>
      </div>

      <div className="space-y-4 p-6 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Add Point of Interest</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="poi-name">Name</Label>
            <Input
              id="poi-name"
              value={newPoi.name || ""}
              onChange={(e) => setNewPoi({ ...newPoi, name: e.target.value })}
              placeholder="POI Name"
            />
          </div>
          
          <div>
            <Label htmlFor="poi-coordinates">Coordinates (lat,lng)</Label>
            <Input
              id="poi-coordinates"
              placeholder="52.3676,4.9041"
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(",").map(Number);
                if (!isNaN(lat) && !isNaN(lng)) {
                  setNewPoi({ ...newPoi, coordinates: [lat, lng] });
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="poi-description">Description</Label>
            <Textarea
              id="poi-description"
              value={newPoi.description || ""}
              onChange={(e) => setNewPoi({ ...newPoi, description: e.target.value })}
              placeholder="Enter POI description"
            />
          </div>

          <div>
            <Label htmlFor="poi-audio">Audio URL</Label>
            <Input
              id="poi-audio"
              value={newPoi.audioUrl || ""}
              onChange={(e) => setNewPoi({ ...newPoi, audioUrl: e.target.value })}
              placeholder="Enter audio file URL"
            />
          </div>

          <Button onClick={handleAddPoi}>Add POI</Button>
        </div>
      </div>

      <div className="space-y-4 p-6 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Current POIs</h2>
        <div className="space-y-4">
          {pois.map((poi) => (
            <div key={poi.id} className="p-4 border rounded">
              <h3 className="font-semibold">{poi.name}</h3>
              <p className="text-sm text-gray-600">
                Coordinates: {poi.coordinates.join(", ")}
              </p>
              <p className="text-sm mt-2">{poi.description}</p>
              {poi.audioUrl && (
                <p className="text-sm text-blue-600 mt-1">{poi.audioUrl}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;