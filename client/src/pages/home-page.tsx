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

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">
            Share your ride with IIT Indore students
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Find trusted rides or share your journey with fellow students
          </p>
          <SearchRides onSearch={setSearchCriteria} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Available Rides</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load rides. Please try again later.
            </div>
          ) : !filteredRides?.length ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                No rides available for this route.
              </p>
              <p className="text-gray-400">
                Try different locations or create a new ride!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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