"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  ScreenerAnswerOption,
  ScreenerQuestion,
  ScreenerSection,
} from "../../api/screener/types";

interface QuestionCardProps {
  section: ScreenerSection;
  question: ScreenerQuestion;
  onAnswerSelected: (answer: ScreenerAnswerOption) => void;
}

export default function QuestionCard({
  section,
  question,
  onAnswerSelected,
}: QuestionCardProps) {
  return (
    <Card className="w-full shadow-2xl gap-4">
      <CardHeader className="space-y-2">
        <p className="">{section.title}</p>
        <h2 className="text-xl font-semibold min-h-14">{question.title}</h2>
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
