'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BrainCircuit, History, ArrowRight, Users, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Link from 'next/link';

const features = [
  { icon: BrainCircuit, title: 'Create Flashcards', description: 'Create Flashcards using AI with adaptive difficulty on any topic!', image: '/images/create-flashcards-bg.jpg', link:'/create-flashcards' },
  { icon: History, title: 'Track Progress', description: 'View your quiz history and performance insights', image: '/images/track-progress-bg.jpg', link:'/create-flashcards' },
];

const statistics = [
  { icon: Users, title: 'Active Users', value: '10,000+', image: '/images/active-users-bg.png' },
  { icon: BookOpen, title: 'Flashcards Created', value: '1M+', image: '/images/flashcards-created-bg.jpeg' },
  { icon: Clock, title: 'Study Hours', value: '500K+', image: '/images/study-hours-bg.jpg' },
];

const CardWithBlurredBackground = ({ children, imageSrc }:any) => (
  <div className="relative overflow-hidden rounded-lg">
    <Image
      src={imageSrc}
      alt="Background"
      layout="fill"
      objectFit="cover"
      className="filter blur-sm brightness-50"
    />
    <div className="relative z-10 bg-background/80 backdrop-blur-sm">
      {children}
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <motion.div 
        className="min-h-screen bg-background text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold">Clever🧠Deck</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </a>
                <a href="#" className="px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90">
                  Get Started
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-16">
          <Parallax speed={-10}>
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1 
                  className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    duration: 0.8
                  }}
                >
                  Master Any Subject with
                  <motion.span 
                    className="text-primary ml-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    AI-Powered Flashcards
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="mt-3 max-w-md mx-auto text-lg text-muted-foreground md:mt-5 md:max-w-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Challenge yourself with flashcards on topics of <strong>your choice</strong>. Personalized, adaptive, and intelligent.
                </motion.p>
                <motion.div 
                  className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center rounded-full bg-white border border-transparent bg-primary py-2 px"
                  >
                    <a href="#" className="w-full flex items-center justify-center px-8 py-3 rounded-md text-primary-foreground text-black bg-primary hover:bg-primary/90 text-base font-medium md:py-4 md:text-lg md:px-10">
                      Get started
                      <ArrowRight className="ml-2" size={20} />
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </Parallax>

          <Parallax speed={10}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div 
                className="grid gap-4 md:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {statistics.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CardWithBlurredBackground imageSrc={stat.image}>
                      <Card className="bg-transparent border-0 hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-2xl font-bold text-white">{stat.title}</CardTitle>
                          <stat.icon size={28} strokeWidth={2.5} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-primary">{stat.value}</p>
                        </CardContent>
                      </Card>
                    </CardWithBlurredBackground>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Parallax>

          <Parallax speed={-5}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                  >
                    <Link href={feature.link}>
                    <CardWithBlurredBackground imageSrc={feature.image}>
                      <Card className="bg-transparent border-0 hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-2xl font-bold text-white">{feature.title}</CardTitle>
                          <feature.icon size={28} strokeWidth={2.5} className="text-primary" />
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </CardWithBlurredBackground>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </Parallax>

          <Parallax speed={5}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <CardWithBlurredBackground imageSrc="/images/Frost.jpg">
                  <Card className="bg-transparent border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-white">Hot Topics</CardTitle>
                      <CardDescription className="text-gray-200">
                        Popular subjects our users are mastering right now.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                      <p className="text-white">Machine Learning, World History, Biology, and more!</p>
                    </CardContent>
                  </Card>
                </CardWithBlurredBackground>
              </motion.div>
            </div>
          </Parallax>
        </main>

        <footer className="border-t mt-16">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-muted-foreground">
                &copy; 2024 CleverDeck. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </ParallaxProvider>
  );
}