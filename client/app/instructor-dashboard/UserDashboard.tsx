import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

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
  user: UserData;
  onClose: () => void;
};

const COLORS = ['#61DAFB', '#FB61DA', '#DAFB61', '#61FB61', '#FB6161'];

const UserDashboard: React.FC<Props> = ({ user, onClose }) => {
  const testData = Object.values(user.tests)[0]?.data;

  const difficultyData = Object.entries(testData.difficulty_performance).map(([difficulty, data]) => ({
    name: difficulty,
    accuracy: data.accuracy * 100,
    averageTime: data.average_time,
  }));

  const pieData = [
    { name: 'Correct', value: testData.total_correct },
    { name: 'Wrong', value: testData.total_wrong },
  ];

  const radarData = [
    {
      subject: 'Overall Accuracy',
      A: testData.overall_accuracy * 100,
      fullMark: 100,
    },
    {
      subject: 'Speed',
      A: 100 - (testData.average_time / 5) * 100, // Assuming 5 seconds is the max time
      fullMark: 100,
    },
    {
      subject: 'Consistency',
      A: (1 - Math.abs(testData.total_correct - testData.total_wrong) / testData.total_questions) * 100,
      fullMark: 100,
    },
    {
      subject: 'Difficulty Handling',
      A: Object.values(testData.difficulty_performance).reduce((acc, curr) => acc + curr.accuracy, 0) / Object.keys(testData.difficulty_performance).length * 100,
      fullMark: 100,
    },
  ];

  const scatterData = testData.wrong_answers.map((answer, index) => ({
    x: answer.time_taken,
    y: answer.difficulty === 'Easy' ? 1 : answer.difficulty === 'Medium' ? 2 : 3,
    z: 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-black rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{user.username}'s Dashboard</h2>
          <button onClick={onClose} className="text-red-500 hover:text-gray-700 hover:duration-500">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#61DAFB"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-domain Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="A" stroke="#61DAFB" fill="#61DAFB" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#DAFB61" activeDot={{ r: 8 }} />
                  <Line yAxisId="right" type="monotone" dataKey="averageTime" stroke="#FB61DA" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wrong Answers Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Time Taken" unit="s" />
                  <YAxis type="number" dataKey="y" name="Difficulty" tickFormatter={(value) => ['Easy', 'Medium', 'Hard'][value - 1]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Wrong Answers" data={scatterData} fill="#DAFB61" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Challenging Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Question</th>
                  <th className="text-left">Accuracy</th>
                  <th className="text-left">Average Time</th>
                  <th className="text-left">Attempts</th>
                </tr>
              </thead>
              <tbody>
                {testData.challenging_questions.map((question, index) => (
                  <tr key={index}>
                    <td>{question.question}</td>
                    <td>{(question.accuracy * 100).toFixed(2)}%</td>
                    <td>{question.average_time.toFixed(2)}s</td>
                    <td>{question.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default UserDashboard;