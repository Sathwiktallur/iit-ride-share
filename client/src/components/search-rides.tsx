import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
    <div className={`grid sm:grid-cols-[1fr_1fr_auto] gap-4 ${className}`}>
      <div>
        <Input
          placeholder="From (e.g. IIT Indore)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>

      <div>
        <Input
          placeholder="To (e.g. Indore Airport)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}