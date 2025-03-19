import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { assessmentIds } = await request.json();

    const assessments = await prisma.assessment.findMany({
      where: {
        id: {
          in: assessmentIds,
        },
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve assessments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
