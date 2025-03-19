import { z } from "zod";

export const answerSchema = z.object({
  question_id: z
    .string()
    .min(1, "QuestionId is required")
    .describe("The Question ID"),
  value: z
    .number()
    .int()
    .min(0, "The minimum value is 0")
    .max(4, "The maximum value is 4")
    .describe("The numerical value associated with the answer"),
});

export const screenerQuestionSchema = z.object({
  question_id: z.string().describe("Unique identifier for the question"),
  title: z.string().describe("The text of the question displayed to the user"),
});

export const screenerAnswerOptionSchema = z.object({
  title: z
    .string()
    .describe("The text of the answer option displayed to the user"),
  value: z
    .number()
    .int()
    .min(0)
    .max(4)
    .describe(
      "Numerical value representing the answer's severity or frequency"
    ),
});

export const screenerSectionSchema = z.object({
  type: z
    .string()
    .describe("Type of section in the screener (e.g., standard, custom)"),
  title: z
    .string()
    .describe("Introductory text or instructions for the section"),
  answers: z
    .array(screenerAnswerOptionSchema)
    .describe("Possible answer options for questions in this section"),
  questions: z
    .array(screenerQuestionSchema)
    .describe("List of questions in this section"),
});

export const screenerContentSchema = z.object({
  sections: z
    .array(screenerSectionSchema)
    .describe("Sections that make up the screener"),
  display_name: z
    .string()
    .describe("Short name or abbreviation for the screener"),
});

export const screenerSchema = z.object({
  id: z.string().describe("Unique identifier for the screener"),
  name: z.string().describe("Internal name of the screener"),
  disorder: z
    .string()
    .describe(
      "Primary mental health condition or domain the screener addresses"
    ),
  content: screenerContentSchema.describe(
    "Detailed content and structure of the screener"
  ),
  fullName: z
    .string()
    .describe("Complete, human-readable name of the screener"),
});

export type Answer = z.infer<typeof answerSchema>;
export type ScreenerQuestion = z.infer<typeof screenerQuestionSchema>;
export type ScreenerAnswerOption = z.infer<typeof screenerAnswerOptionSchema>;
export type ScreenerSection = z.infer<typeof screenerSectionSchema>;
export type ScreenerContent = z.infer<typeof screenerContentSchema>;
export type Screener = z.infer<typeof screenerSchema>;
