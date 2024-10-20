"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this import is correct
import { useAuth } from "@/context/AuthContext";
import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";



const Dashboard = () => {
  const router = useRouter();
  const { userEmail } = useAuth();
  const [recentActivity, setRecentActivity] = useState<any>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) {
        router.push("/");
        return;
      }

      try {
        const testsRef = collection(db, 'Users', userEmail, 'Tests');
        const q = query(testsRef, orderBy("data.timeEnded", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        const recentActivityData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data().data
        }));
        console.log(recentActivityData);
        setRecentActivity(recentActivityData);
        setTotalQuizzes(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userEmail, router]);

  if (!userEmail) {
    return null; // or a loading spinner
  }

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

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard totalQuizzes={totalQuizzes} />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard recentActivity={recentActivity} totalQuizzes={totalQuizzes} />
      </div>
    </main>
  );
};

export default Dashboard;