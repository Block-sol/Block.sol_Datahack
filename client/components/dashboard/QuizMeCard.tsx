"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BrainCircuit } from "lucide-react";
import { motion } from 'framer-motion';
import FlashcardCreation from "../FlashcardCreation";

type Props = {};

const feature = {
  icon: BrainCircuit,
  title: 'Create Flashcards',
  description: 'Create Flashcards using AI with adaptive difficulty on any topic!',
  image: '/images/create-flashcards-bg.jpg',
  link: '/create-flashcards'
};

const QuizMeCard = (props: Props) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="cursor-pointer border-white border rounded-xl"
    >
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setIsCreateModalOpen(true)}>
            <Card className="bg-transparent border-0 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                <feature.icon size={28} strokeWidth={2.5} className="text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <FlashcardCreation />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default QuizMeCard;