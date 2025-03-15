import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

type SearchRidesProps = {
  className?: string;
  onSearch: (criteria: { source: string; destination: string }) => void;
};

export default function SearchRides({ className, onSearch }: SearchRidesProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    onSearch({ source, destination });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Find a Ride</h2>
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Leaving from..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Going to..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <Button 
          size="lg"
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}