import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, Users, IndianRupee, Loader2 } from "lucide-react";
import type { Ride } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type RideCardProps = {
  ride: Ride;
  showStatus?: boolean;
};

export default function RideCard({ ride, showStatus = false }: RideCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const joinRideMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rides/${ride.id}/requests`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Success",
        description: "Join request sent successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isCreator = ride.creatorId === user?.id;
  const departureDate = new Date(ride.departureTime);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{ride.source}</span>
              <span className="mx-2">→</span>
              <span>{ride.destination}</span>
            </div>
            {showStatus && (
              <div className={`px-3 py-1 rounded-full text-sm ${
                ride.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {ride.status}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(departureDate, "PPp")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{ride.availableSeats} seats available</span>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <span>₹{ride.costPerSeat} per seat</span>
            </div>
          </div>
        </div>
      </CardContent>

      {!isCreator && ride.status === 'active' && (
        <CardFooter className="pt-4">
          <Button 
            className="w-full"
            onClick={() => joinRideMutation.mutate()}
            disabled={joinRideMutation.isPending}
          >
            {joinRideMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request to Join
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
