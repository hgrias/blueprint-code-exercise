import { Badge } from "@/components/ui/badge";

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
        <p>Your Progress</p>
        <Badge variant="outline" className="">
          Question {currentQuestionNumber} of {totalQuestions}
        </Badge>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
