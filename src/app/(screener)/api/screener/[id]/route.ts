import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validate screener ID format
const screenerIdSchema = z.string().min(1, "Screener ID cannot be empty");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate screener ID
    const screenerIdValidation = screenerIdSchema.safeParse(id);

    if (!screenerIdValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid screener ID",
          details: screenerIdValidation.error.format(),
        },
        { status: 400 }
      );
    }

    const screenerId = screenerIdValidation.data;

    // Check for potential SQL injection or malicious input
    if (screenerId.includes("'") || screenerId.includes(";")) {
      return NextResponse.json(
        { error: "Invalid screener ID format" },
        { status: 400 }
      );
    }

    // Get the screener from DB
    const screener = await db.screener.findUnique({
      where: { id: screenerId },
    });

    if (!screener) {
      return NextResponse.json(
        {
          error: "Screener not found",
          details: `No screener exists with ID: ${screenerId}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(screener);
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
    console.error("Unhandled screener retrieval error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve screener",
        details:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
