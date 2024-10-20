'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      router.push(isAdmin ? "/admin-dashboard" : "/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithGoogle();
      router.push(isAdmin ? "/instructor-dashboard" : "/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md border border-white w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <div className="flex justify-center mb-6">
          <motion.div
            className="bg-gray-200 dark:bg-gray-800 p-1 rounded-full flex items-center"
            initial={false}
            animate={{ backgroundColor: isAdmin ? "#4F46E5" : "#E5E7EB" }}
          >
            <motion.div
              className="w-24 h-8 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center cursor-pointer"
              layout
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 30
              }}
              onClick={() => setIsAdmin(!isAdmin)}
            >
              <motion.span
                className="text-sm text-white font-medium"
                animate={{ color: isAdmin ? "#4F46E5" : "#FFF" }}
              >
                {isAdmin ? "Admin" : "User"}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>

        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to CleverDeck
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign in to continue to CleverDeck ({isAdmin ? "Admin" : "User"})
        </p>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              placeholder="projectmayhem@fc.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              placeholder="••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          <motion.button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in &rarr;
            <BottomGradient />
          </motion.button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <motion.button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Continue with Google
              </span>
              <BottomGradient />
            </motion.button>
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Don't Have an Account? Sign up <u><a href="/signup" className="text-blue-500">Here!</a></u>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login;