import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, Users, IndianRupee, Loader2, Star, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { Ride, RideRequest } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ChatBox from "./chat-box";

type RideCardProps = {
  ride: Ride;
  showStatus?: boolean;
};

export default function RideCard({ ride, showStatus = false }: RideCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  const { data: requests } = useQuery<RideRequest[]>({
    queryKey: [`/api/rides/${ride.id}/requests`],
    enabled: ride.creatorId === user?.id,
  });

  const pendingRequests = requests?.filter(req => req.status === 'pending');

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
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
    },
  });

  const updateRideStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest(
        "PATCH",
        `/api/rides/${ride.id}/status`,
        { status }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({
        title: "Success",
        description: "Ride status updated successfully",
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
      setIsRatingDialogOpen(false);
    },
  });

  const isCreator = ride.creatorId === user?.id;
  const departureDate = new Date(ride.departureTime);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{ride.source}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span>{ride.destination}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {format(departureDate, "EEEE, MMMM d 'at' h:mm a")}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              ride.status === 'active'
                ? 'bg-green-100 text-green-700'
                : ride.status === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {ride.status}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
              <div className="text-sm font-medium">{ride.availableSeats} seats</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-600" />
              <div className="text-sm font-medium">{format(departureDate, "MMM d")}</div>
            </div>
            <div className="text-center">
              <IndianRupee className="h-5 w-5 mx-auto mb-1 text-gray-600" />
              <div className="text-sm font-medium">₹{ride.costPerSeat}</div>
            </div>
          </div>

          {isCreator && pendingRequests && pendingRequests.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-red-600">New Join Requests!</h3>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-sm">
                  {pendingRequests.length}
                </span>
              </div>
              <div className="space-y-2">
                {requests?.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">User #{request.userId}</span>
                    {request.status === 'pending' && (
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-green-50 hover:text-green-700"
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
                          className="hover:bg-red-50 hover:text-red-700"
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
            </div>
          )}

          {showChat && <ChatBox rideId={ride.id} isCreator={isCreator} />}
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex gap-2 border-t">
        {isCreator && ride.status === 'pending' && (
          <Button
            className="flex-1"
            onClick={() => updateRideStatusMutation.mutate('active')}
            disabled={updateRideStatusMutation.isPending}
          >
            {updateRideStatusMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Start Ride
          </Button>
        )}

        {isCreator && ride.status === 'active' && (
          <Button
            className="flex-1"
            onClick={() => updateRideStatusMutation.mutate('completed')}
            disabled={updateRideStatusMutation.isPending}
          >
            {updateRideStatusMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Complete Ride
          </Button>
        )}

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
          <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
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

        {(ride.status === 'active' || ride.status === 'pending') && (
          <Button
            variant="outline"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}