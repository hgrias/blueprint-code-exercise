"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Screener, ScreenerAnswerOption } from "../../api/screener/types";
import CompletionScreen from "../components/completion-screen";
import ProgressBar from "../components/progress-bar";
import QuestionCard from "../components/question-card";

type Answer = {
  questionId: string;
  value: number;
};

export default function ScreenerQuestionnaire({
  screener,
}: {
  screener: Screener;
}) {
  // Calculate total questions across all sections
  const totalQuestions = screener.content.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  // State to track current section and question indices
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<Assessment[]>([]);

  // Get current section and question
  const currentSection = screener.content.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  // Calculate overall question number (across all sections)
  const calculateOverallQuestionNumber = () => {
    let questionNumber = currentQuestionIndex + 1;

    // Add questions from previous sections
    for (let i = 0; i < currentSectionIndex; i++) {
      questionNumber += screener.content.sections[i].questions.length;
    }

    return questionNumber;
  };

  const currentQuestionNumber = calculateOverallQuestionNumber();
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  // Handle answer selection
  const handleAnswerSelected = (answer: ScreenerAnswerOption) => {
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.question_id,
        value: answer.value,
      },
    ];

    // Move to next question or section
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      // Move to next question in current section
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswers(newAnswers);
    } else if (currentSectionIndex < screener.content.sections.length - 1) {
      // Move to first question of next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
      setAnswers(newAnswers);
    } else {
      // Last question of last section
      const finalAnswers = [...newAnswers];

      // Immediately submit the answers
      submitAnswersMutation.mutate(finalAnswers);
    }
  };

  async function submitScreenerAnswers(
    answers: Answer[]
  ): Promise<{ results: string[] }> {
    const response = await fetch("/api/screener/assess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: answers.map((a) => ({
          question_id: a.questionId,
          value: a.value,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit assessment");
    }

    return response.json();
  }

  const submitAnswersMutation = useMutation({
    mutationFn: submitScreenerAnswers,
    onSuccess: async (assessmentResults: { results: string[] }) => {
      const assessmentIds = assessmentResults.results || [];
      if (assessmentIds && assessmentIds.length > 0) {
        try {
          const response = await fetch("/api/assessments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ assessmentIds }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch assessments");
          }

          const recommendedAssessments =
            (await response.json()) as Assessment[];

          setAssessmentResults(recommendedAssessments);
        } catch (error) {
          console.error("Error fetching assessments:", error);
        }
      }

      // Mark the screener complete
      setIsComplete(true);
    },
  });

  if (submitAnswersMutation.isPending) {
    return (
      <Card className="w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Processing Assessment</h2>
          <p className="text-muted-foreground">
            Please wait while we analyze your responses
          </p>
        </CardHeader>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <CompletionScreen
        assessments={assessmentResults || []}
        screener={screener}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{screener.fullName}</h1>
        <p className="text-muted-foreground">{screener.content.display_name}</p>
      </div>

      <ProgressBar progress={progress} />

      <QuestionCard
        section={currentSection}
        question={currentQuestion}
        questionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
        onAnswerSelected={handleAnswerSelected}
      />
    </div>
  );
}
