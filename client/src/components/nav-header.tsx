import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Plus, History, Home, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavHeader() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="font-bold text-xl text-primary">IIT Indore Ride Share</a>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/create-ride">
              <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                <Plus className="mr-2 h-4 w-4" />
                Create Ride
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="hover:bg-primary/5">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline font-medium text-gray-700">
            Welcome, {user?.fullName}
          </span>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/">
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                </Link>
                <Link href="/create-ride">
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Ride
                  </DropdownMenuItem>
                </Link>
                <Link href="/history">
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    History
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}