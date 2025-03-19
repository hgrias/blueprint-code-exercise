"use client";

import type {
  ScreenerSection,
  ScreenerQuestion,
  ScreenerAnswerOption,
} from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
  section: ScreenerSection;
  question: ScreenerQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (answer: ScreenerAnswerOption) => void;
}

export default function QuestionCard({
  section,
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
}: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <p className="text-sm text-muted-foreground">{section.title}</p>
        <h2 className="text-xl font-semibold">{question.title}</h2>
        <p className="text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {section.answers.map((answer) => (
            <Button
              key={answer.value}
              variant="outline"
              className="justify-start h-auto py-4 px-4 text-left"
              onClick={() => onAnswerSelected(answer)}
            >
              {answer.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
