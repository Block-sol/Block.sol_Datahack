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
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
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