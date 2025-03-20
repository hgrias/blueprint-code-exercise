import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  currentQuestionNumber: number;
  totalQuestions: number;
}

export default function ProgressBar({
  progress,
  currentQuestionNumber,
  totalQuestions,
}: ProgressBarProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        <p className="font-semibold">Your Progress</p>
        <Badge variant="default">
          Question {currentQuestionNumber} of {totalQuestions}
        </Badge>
      </div>
      <Progress value={progress} />
    </div>
  );
}
