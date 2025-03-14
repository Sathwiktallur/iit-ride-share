import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavHeader from "@/components/nav-header";
import SearchRides from "@/components/search-rides";
import RideCard from "@/components/ride-card";
import { Loader2 } from "lucide-react";
import type { Ride } from "@shared/schema";

export default function HomePage() {
  const [searchCriteria, setSearchCriteria] = useState({
    source: "",
    destination: "",
  });

  const { data: rides, isLoading, error } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const filteredRides = rides?.filter((ride) => {
    const matchSource = !searchCriteria.source || 
      ride.source.toLowerCase().includes(searchCriteria.source.toLowerCase());
    const matchDestination = !searchCriteria.destination || 
      ride.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase());
    return matchSource && matchDestination;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Available Rides</h1>

          <SearchRides 
            className="mb-8" 
            onSearch={setSearchCriteria}
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load rides. Please try again later.
            </div>
          ) : !filteredRides?.length ? (
            <div className="text-center py-12 text-gray-500">
              No rides available at the moment.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}