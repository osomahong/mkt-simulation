"use client";

import { z } from "zod";

export const scenarioStepSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    feedback: z.string().optional(),
  })),
});

export const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).optional(),
  steps: z.array(scenarioStepSchema),
});

export type Scenario = z.infer<typeof scenarioSchema>; 

export type ScenarioSummary = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
};

export interface Choice {
  text: string;
  tags: string[];
}

export interface Question {
  id: string;
  set: string;
  category: string;
  difficulty: '쉬움' | '보통' | '어려움';
  marketerType: string[];
  question: string;
  choices: Choice[];
} 