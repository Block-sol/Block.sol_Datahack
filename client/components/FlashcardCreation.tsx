"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const flashcardCreationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  flashcardType: z.enum(["text", "image", "audio", "video"]),
  sourceType: z.enum(["text", "pdf", "ppt", "image", "document"]),
  amount: z.number().min(1).max(50),
});

type FlashcardCreationInput = z.infer<typeof flashcardCreationSchema>;

const FlashcardCreation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FlashcardCreationInput>({
    resolver: zodResolver(flashcardCreationSchema),
    defaultValues: {
      topic: "",
      flashcardType: "text",
      sourceType: "text",
      amount: 5,
    },
  });

//   const onSubmit = (data: FlashcardCreationInput) => {
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       toast({
//         title: "Success",
//         description: "Flashcards created successfully!",
//       });
//     }, 2000);
//   };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Create Flashcards</h2>
      <p className="text-muted-foreground mb-6">Generate personalized flashcards</p>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a topic" {...field} />
                </FormControl>
                <FormDescription>
                  Specify the topic for your flashcards
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flashcardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flashcard Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select flashcard type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the type of flashcards to generate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="ppt">PowerPoint</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of source material
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Flashcards</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    min={1}
                    max={50}
                  />
                </FormControl>
                <FormDescription>
                  Choose how many flashcards to generate (1-50)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Create Flashcards"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default FlashcardCreation;