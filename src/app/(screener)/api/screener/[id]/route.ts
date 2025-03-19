import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const screener = await db.screener.findUnique({
      where: { id: params.id },
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
