import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: screenerId } = await params;

  try {
    const screener = await db.screener.findUnique({
      where: { id: screenerId },
    });

    if (!screener) {
      return NextResponse.json(
        { error: "Screener not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(screener);
  } catch (error) {
    console.error("Screener retrieval error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve screener",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
