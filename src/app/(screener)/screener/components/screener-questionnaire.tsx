"use client";

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
    // Save the answer
    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.question_id,
        value: answer.value,
      },
    ]);

    // Move to next question or section
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      // Move to next question in current section
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < screener.content.sections.length - 1) {
      // Move to first question of next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Questionnaire complete
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return <CompletionScreen answers={answers} screener={screener} />;
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
