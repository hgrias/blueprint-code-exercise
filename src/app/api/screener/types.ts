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

export type Answer = z.infer<typeof answerSchema>;

export const DomainObjectSchema = z.object({
  domainId: z.string(),
  threshold: z.number().int().min(0),
  assessment: z.string(),
});

export type DomainObject = z.infer<typeof DomainObjectSchema>;
