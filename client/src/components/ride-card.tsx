import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, Users, IndianRupee, Loader2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Ride, RideRequest } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type RideCardProps = {
  ride: Ride;
  showStatus?: boolean;
};

export default function RideCard({ ride, showStatus = false }: RideCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");

  const { data: requests } = useQuery<RideRequest[]>({
    queryKey: [`/api/rides/${ride.id}/requests`],
    enabled: ride.creatorId === user?.id,
  });

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

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number; status: string }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/rides/${ride.id}/requests/${requestId}`,
        { status }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/rides/${ride.id}/requests`] });
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
    },
  });

  const rateRideMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/rides/${ride.id}/ratings`, {
        rating: parseInt(rating),
        review,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
      setRating("5");
      setReview("");
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

          {isCreator && requests && requests.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Join Requests:</h3>
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>User #{request.userId} - {request.status}</span>
                  {request.status === 'pending' && (
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRequestMutation.mutate({ 
                          requestId: request.id, 
                          status: 'accepted' 
                        })}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateRequestMutation.mutate({ 
                          requestId: request.id, 
                          status: 'rejected' 
                        })}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex gap-2">
        {!isCreator && ride.status === 'active' && (
          <Button 
            className="flex-1"
            onClick={() => joinRideMutation.mutate()}
            disabled={joinRideMutation.isPending}
          >
            {joinRideMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request to Join
          </Button>
        )}

        {!isCreator && ride.status === 'completed' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Star className="mr-2 h-4 w-4" />
                Rate Ride
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate your ride experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Review</Label>
                  <Input
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => rateRideMutation.mutate()}
                  disabled={rateRideMutation.isPending}
                >
                  {rateRideMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Rating
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}