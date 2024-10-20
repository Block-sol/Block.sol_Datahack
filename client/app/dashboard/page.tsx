'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-white">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl px-10 font-semibold text-white">Your Learning Overview </h2>
            <DetailsDialog />
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <QuizMeCard />
            <HistoryCard />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivityCard />
            </div>
            <div>
              <HotTopicsCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;