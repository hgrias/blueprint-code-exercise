import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Answer } from "./types";

// Create a singleton Prisma client
const prisma = new PrismaClient();

// Cache for domain mappings
let cachedDomainMappings: {
  questionToDomainMap: Record<
    string,
    { domainId: string; threshold: number; assessment: string }
  >;
  domainToInfoMap: Record<string, { threshold: number; assessment: string }>;
} | null = null;

// Load domain mappings from the database
async function loadDomainMappings() {
  // Return cached mappings if available
  if (cachedDomainMappings) return cachedDomainMappings;

  const domains = await prisma.domain.findMany({
    include: {
      questions: {
        select: { id: true },
      },
    },
  });

  // Create a mapping of question IDs to respective domain objects
  const questionToDomainMap = domains.reduce((map, domain) => {
    domain.questions.forEach((question) => {
      map[question.id] = {
        domainId: domain.id,
        threshold: domain.threshold || 2,
        assessment: domain.assessmentId || "UNDEFINED_ASSESSMENT",
      };
    });
    return map;
  }, {} as Record<string, { domainId: string; threshold: number; assessment: string }>);

  // Create a mapping of domain IDs to their info
  const domainToInfoMap = domains.reduce((map, domain) => {
    map[domain.id] = {
      threshold: domain.threshold || 2,
      assessment: domain.assessmentId || "UNDEFINED_ASSESSMENT",
    };
    return map;
  }, {} as Record<string, { threshold: number; assessment: string }>);

  // Set the mappings to the cache
  cachedDomainMappings = {
    questionToDomainMap,
    domainToInfoMap,
  };

  return cachedDomainMappings;
}

export async function POST(request: NextRequest) {
  try {
    // Load domain mappings
    const { questionToDomainMap, domainToInfoMap } = await loadDomainMappings();

    // Parse incoming answers
    const { answers } = (await request.json()) as { answers: Answer[] };

    // Keep track of domain scores
    const domainScores: Record<string, number> = {};

    answers.forEach((answer) => {
      // Get the domain for the question via the mapping
      const { domainId } = questionToDomainMap[answer.question_id];

      // Throw error if there is no domain associated with the question
      if (!domainId) {
        throw new Error(
          `Question ID does not have an associated domain: ${answer.question_id}`
        );
      }

      // Add score to domain
      domainScores[domainId] = (domainScores[domainId] || 0) + answer.value;
    });

    // Determine assessments based on domain scores and thresholds
    const assessments: string[] = [];

    // Get assessments for domains
    for (const [domainId, score] of Object.entries(domainScores)) {
      // Get the scoring threshold and relevant assessment for the domain
      const { threshold, assessment } = domainToInfoMap[domainId];

      // Check if domain score meets its threshold
      if (score >= threshold) {
        // Add assessment if not already in results
        if (!assessments.includes(assessment)) {
          assessments.push(assessment);
        }
      }
    }

    // TODO: Store answers in DB for specific user

    return NextResponse.json({ results: assessments });
  } catch (error) {
    console.error("Screener computation error:", error);
    return NextResponse.json(
      {
        error: "Failed to compute assessments for screener",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
