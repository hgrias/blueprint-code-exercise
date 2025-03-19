import type { Screener } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type Answer = {
  questionId: string;
  value: number;
};

interface CompletionScreenProps {
  answers: Answer[];
  screener: Screener;
}

export default function CompletionScreen({ screener }: CompletionScreenProps) {
  return (
    <Card className="w-full text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Assessment Complete</h2>
        <p className="text-muted-foreground">
          Thank you for completing the {screener.full_name}
        </p>
      </CardHeader>
      <CardContent>
        <p>Your responses have been recorded.</p>
      </CardContent>
    </Card>
  );
}
