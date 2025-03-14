import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Plus, History, Home } from "lucide-react";

export default function NavHeader() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="font-bold text-lg">IIT Indore Ride Share</a>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/create-ride">
              <Button variant="ghost" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Ride
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">Welcome, {user?.fullName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
