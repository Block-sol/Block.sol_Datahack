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
import { useRouter } from "next/navigation";

const flashcardCreationSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  flashcardType: z.enum(["text", "image", "audio", "video"]),
  sourceType: z.enum(["text", "pdf", "ppt", "image", "document"]),
  amount: z.number().min(1).max(50),
  file: z
    .any()
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});

type FlashcardCreationInput = z.infer<typeof flashcardCreationSchema>;

const FlashcardCreation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<FlashcardCreationInput>({
    resolver: zodResolver(flashcardCreationSchema),
    defaultValues: {
      topic: "",
      flashcardType: "text",
      sourceType: "text",
      amount: 5,
    },
  });

  const sourceType = form.watch("sourceType");

  const onSubmit = async (data: FlashcardCreationInput) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (data.file) {
        formData.append('file', data.file);
      }
      
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file and generate questions');
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message,
      });
      if(result){
        console.log(result);
        router.push('/quiz');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Create Flashcards</h2>
      <p className="text-muted-foreground mb-6">
        Generate personalized flashcards
      </p>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

          {sourceType !== "text" && (
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="text-white"
                      accept={
                        sourceType === "pdf"
                          ? "application/pdf"
                          : sourceType === "ppt"
                          ? "application/vnd.ms-powerpoint"
                          : sourceType === "image"
                          ? "image/*"
                          : sourceType === "document"
                          ? ".doc,.docx,.pdf"
                          : undefined
                      }
                      onChange={(e) => {field.onChange(e.target.files?.[0]); console.log(e.target.files?.[0]);}}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a {sourceType.toUpperCase()} file
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

            <Button type="submit" className="w-full" disabled={isLoading}>
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
