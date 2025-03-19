import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Assessment } from "@prisma/client";
import { CheckCircle } from "lucide-react";
import type { Screener } from "../../api/screener/types";

interface CompletionScreenProps {
  assessments: Assessment[];
  screener: Screener;
}

export default function CompletionScreen({
  assessments,
  screener,
}: CompletionScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Assessment Complete</h2>
          <p className="text-muted-foreground">
            Thank you for completing the {screener.fullName}
          </p>
        </CardHeader>
      </Card>

      {assessments && assessments.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Recommended Follow-up Assessments
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {assessments.map((assessment) => (
              <a
                key={assessment.id}
                href={assessment.referenceUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="hover:bg-muted/50 transition-colors h-36">
                  <CardHeader>
                    <h4 className="text-lg font-semibold">{assessment.name}</h4>
                    {assessment.description && (
                      <p className="text-muted-foreground text-sm">
                        {assessment.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <Card className="w-full text-center">
          <CardContent>
            <p>
              No specific follow-up assessments are recommended at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
