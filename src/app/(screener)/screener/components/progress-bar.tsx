import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentQuestionNumber: number;
  totalQuestions: number;
}

export default function ProgressBar({
  currentQuestionNumber,
  totalQuestions,
}: ProgressBarProps) {
  const progress = (currentQuestionNumber / totalQuestions) * 100;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <p className="font-semibold">Your Progress</p>
        <Badge variant="default" className="bg-blue-600">
          Question {currentQuestionNumber} of {totalQuestions}
        </Badge>
      </div>
      <Progress value={progress} />
    </div>
  );
}
