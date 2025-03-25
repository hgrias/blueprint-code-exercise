import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validate assessment IDs
const assessmentRequestSchema = z.object({
  assessmentIds: z
    .array(z.string().min(1, "Assessment ID cannot be empty"))
    .min(1, "At least one assessment ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const jsonBody = await request.json();
    const validation = assessmentRequestSchema.safeParse(jsonBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { assessmentIds } = validation.data;

    // Prevent potential SQL injection
    if (assessmentIds.some((id) => id.includes("'") || id.includes(";"))) {
      return NextResponse.json(
        { error: "Invalid assessment ID format" },
        { status: 400 }
      );
    }

    const assessments = await db.assessment.findMany({
      where: {
        id: {
          in: assessmentIds,
        },
      },
    });

    // Check if all requested assessments were found
    const foundAssessmentIds = assessments.map((a) => a.id);
    const missingAssessmentIds = assessmentIds.filter(
      (id) => !foundAssessmentIds.includes(id)
    );

    if (missingAssessmentIds.length > 0) {
      return NextResponse.json(
        {
          error: "Some assessments not found",
          details: missingAssessmentIds,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(assessments);
  } catch (error) {
    // Differentiate between different types of errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.format(),
        },
        { status: 400 }
      );
    }

    // Specific database connection errors
    if (error instanceof Error && error.message.includes("Connection")) {
      return NextResponse.json(
        {
          error: "Database connection error",
          details: "Unable to connect to the database",
        },
        { status: 503 }
      );
    }

    // Catch-all for unexpected errors
    console.error("Unhandled assessments retrieval error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve assessments",
        details:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
