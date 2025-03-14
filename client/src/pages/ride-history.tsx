import { useQuery } from "@tanstack/react-query";
import NavHeader from "@/components/nav-header";
import RideCard from "@/components/ride-card";
import { Loader2 } from "lucide-react";
import type { Ride } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function RideHistory() {
  const { user } = useAuth();
  const { data: rides, isLoading, error } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const userRides = rides?.filter(
    (ride) => ride.creatorId === user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Your Ride History</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load ride history. Please try again later.
            </div>
          ) : !userRides?.length ? (
            <div className="text-center py-12 text-gray-500">
              You haven't created any rides yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {userRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} showStatus />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
