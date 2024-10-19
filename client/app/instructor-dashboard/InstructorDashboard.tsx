import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import UserDashboard from './UserDashboard';
import { UserIcon, ClockIcon, CheckCircleIcon, BookOpenIcon, BrainIcon, TrendingUpIcon } from 'lucide-react';

const StatItem = ({ icon: Icon, label, value, color }:any) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
    <div className={`p-2 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

type UserData = {
  username: string;
  createdAt: string;
  updatedAt: string;
  tests: {
    [key: string]: {
      type: string;
      data: {
        total_questions: number;
        total_correct: number;
        total_wrong: number;
        overall_accuracy: number;
        average_time: number;
        difficulty_performance: {
          [key: string]: {
            accuracy: number;
            average_time: number;
            total_questions: number;
          };
        };
        challenging_questions: Array<{
          question: string;
          accuracy: number;
          average_time: number;
          attempts: number;
        }>;
        wrong_answers: Array<{
          question: string;
          user_answer: string;
          correct_answer: string;
          options: {
            [key: string]: string;
          };
          difficulty: string;
          time_taken: number;
        }>;
      };
    };
  };
};


type Props = {
  users: Record<string, UserData>;
};

const InstructorDashboard: React.FC<Props> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const userArray = Object.entries(users).map(([email, data]) => ({
    email,
    ...data,
  }));

  const compareData = userArray.map((user) => {
    const testData = Object.values(user.tests)[0]?.data;
    return {
      name: user.username,
      accuracy: testData?.overall_accuracy * 100 || 0,
      averageTime: testData?.average_time || 0,
      totalQuestions: testData?.total_questions || 0,
      correctAnswers: testData?.total_correct || 0,
    };
  });

  const averageAccuracy = compareData.reduce((sum, user) => sum + user.accuracy, 0) / compareData.length;
  const averageTime = compareData.reduce((sum, user) => sum + user.averageTime, 0) / compareData.length;

  function calculateAverageDifficulty(users: Record<string, UserData>): string {
    const difficultyMap: { [key: string]: number } = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    let totalDifficulty = 0;
    let totalQuestions = 0;
  
    Object.values(users).forEach(user => {
      Object.values(user.tests).forEach(test => {
        Object.entries(test.data.difficulty_performance).forEach(([difficulty, data]) => {
          totalDifficulty += difficultyMap[difficulty] * data.total_questions;
          totalQuestions += data.total_questions;
        });
      });
    });
  
    const averageDifficulty = totalQuestions > 0 ? totalDifficulty / totalQuestions : 0;
    
    if (averageDifficulty < 1.5) return 'Easy';
    if (averageDifficulty < 2.5) return 'Medium';
    return 'Hard';
  }

  function calculateLearningProgress(users: Record<string, UserData>): number {
    let totalProgress = 0;
    let userCount = 0;
  
    Object.values(users).forEach(user => {
      const tests = Object.values(user.tests);
      if (tests.length > 1) {
        const firstTest = tests[0].data;
        const lastTest = tests[tests.length - 1].data;
        const progress = (lastTest.overall_accuracy - firstTest.overall_accuracy) * 100;
        totalProgress += progress > 0 ? progress : 0;
        userCount++;
      }
    });
  
    return userCount > 0 ? totalProgress / userCount : 0;
  }


  const averageDifficulty = calculateAverageDifficulty(users);
  const learningProgress = calculateLearningProgress(users);

  const doughnutData = {
    labels: ['Above Average', 'Below Average'],
    datasets: [
      {
        data: [
          compareData.filter((user) => user.accuracy > averageAccuracy).length,
          compareData.filter((user) => user.accuracy <= averageAccuracy).length,
        ],
        backgroundColor: ['#FB6161', '#61DAFB'],
        hoverBackgroundColor: ['#FB6168', '#61DAFF'],
      },
    ],
  };

  const radarData = compareData.map((user) => ({
    subject: user.name,
    accuracy: user.accuracy,
    speed: 100 - (user.averageTime / Math.max(...compareData.map(u => u.averageTime)) * 100),
    consistency: (user.correctAnswers / user.totalQuestions) * 100,
  }));

  const statData = compareData;

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userArray.map((user, index) => (
          <motion.div
            key={user.email}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              onClick={() => setSelectedUser(user.email)}
              onMouseEnter={() => setHoveredUser(user.email)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <CardHeader>
                <CardTitle>{user.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                <AnimatePresence>
                  {hoveredUser === user.email && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <p className="text-sm font-semibold">Quick Stats:</p>
                      <p className="text-sm">Accuracy: {(Object.values(user.tests)[0]?.data.overall_accuracy * 100).toFixed(2)}%</p>
                      <p className="text-sm">Avg Time: {Object.values(user.tests)[0]?.data.average_time.toFixed(2)}s</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-domain Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#FB61DA" fill="#FB61DA" fillOpacity={0.6} />
                <Radar name="Speed" dataKey="speed" stroke="#61DAFB" fill="#61DAFB" fillOpacity={0.6} />
                <Radar name="Consistency" dataKey="consistency" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={doughnutData} />
            </div>
          </CardContent>
        </Card>
      <Card className="bg-transparent border-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Overall Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatItem 
                icon={UserIcon}
                label="Total Users"
                value={userArray.length}
                color="bg-blue-500"
              />
              <StatItem 
                icon={CheckCircleIcon}
                label="Average Accuracy"
                value={`${averageAccuracy.toFixed(2)}%`}
                color="bg-green-500"
              />
              <StatItem 
                icon={ClockIcon}
                label="Avg Time per Question"
                value={`${averageTime.toFixed(2)}s`}
                color="bg-purple-500"
              />
              <StatItem 
                icon={BookOpenIcon}
                label="Total Questions Attempted"
                value={statData.reduce((sum, user) => sum + user.totalQuestions, 0)}
                color="bg-yellow-500"
              />
              <StatItem 
                icon={BrainIcon}
                label="Average Difficulty"
                value={averageDifficulty}
                color="bg-red-500"
              />
              <StatItem 
                icon={TrendingUpIcon}
                label="Learning Progress"
                value={`${learningProgress.toFixed(2)}%`}
                color="bg-indigo-500"
              />
            </CardContent>
          </Card>
        
      </div>

      {selectedUser && (
        <UserDashboard user={users[selectedUser]} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default InstructorDashboard;