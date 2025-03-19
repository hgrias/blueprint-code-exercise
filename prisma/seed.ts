import { PrismaClient } from "@prisma/client";
import domainMapping from "../src/data/domain-mapping.json";
import sampleAssessments from "../src/data/sample-assessments.json";
import sampleDomains from "../src/data/sample-domains.json";
import sampleQuestions from "../src/data/sample-questions.json";

const prisma = new PrismaClient();

async function main() {
  // Create domains from sample-domains.json
  for (const domainData of sampleDomains) {
    await prisma.domain.upsert({
      where: { id: domainData.id },
      update: {},
      create: {
        id: domainData.id,
        name: domainData.name,
        description: domainData.description,
        threshold: domainData.threshold,
      },
    });
  }

  // Create example screener
  await prisma.screener.upsert({
    where: { id: "abcd-123" },
    update: {},
    create: {
      id: "abcd-123",
      name: "BPDS",
      displayName: "BDS",
      fullName: "Blueprint Diagnostic Screener",
      disorder: "Cross-Cutting",
      content: {
        sections: [
          {
            type: "standard",
            title:
              "During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?",
            answers: [
              { title: "Not at all", value: 0 },
              { title: "Rare, less than a day or two", value: 1 },
              { title: "Several days", value: 2 },
              { title: "More than half the days", value: 3 },
              { title: "Nearly every day", value: 4 },
            ],
            questions: [
              {
                question_id: "question_a",
                title: "Little interest or pleasure in doing things?",
              },
              {
                question_id: "question_b",
                title: "Feeling down, depressed, or hopeless?",
              },
              {
                question_id: "question_c",
                title:
                  "Sleeping less than usual, but still have a lot of energy?",
              },
              {
                question_id: "question_d",
                title:
                  "Starting lots more projects than usual or doing more risky things than usual?",
              },
              {
                question_id: "question_e",
                title:
                  "Feeling nervous, anxious, frightened, worried, or on edge?",
              },
              {
                question_id: "question_f",
                title: "Feeling panic or being frightened?",
              },
              {
                question_id: "question_g",
                title: "Avoiding situations that make you feel anxious?",
              },
              {
                question_id: "question_h",
                title:
                  "Drinking at least 4 drinks of any kind of alcohol in a single day?",
              },
            ],
          },
        ],
        display_name: "BDS",
      },
    },
  });

  // Create questions and map them to correct domains
  for (const mapping of domainMapping) {
    const question = sampleQuestions.find(
      (q) => q.question_id === mapping.question_id
    );

    if (question) {
      await prisma.question.upsert({
        where: { id: question.question_id },
        update: {},
        create: {
          id: question.question_id,
          title: question.title,
          domainId: mapping.domain,
        },
      });
    }
  }

  // Create assessments
  for (const assessmentData of sampleAssessments) {
    await prisma.assessment.upsert({
      where: { id: assessmentData.id },
      update: {},
      create: {
        id: assessmentData.id,
        name: assessmentData.name,
        description: assessmentData.description,
        referenceUrl: assessmentData.referenceUrl,
      },
    });
  }

  // Map assessments to domains
  const domainAssessmentMapping = {
    depression: "PHQ-9",
    anxiety: "PHQ-9",
    mania: "ASRM",
    substance_use: "ASSIST",
  };

  for (const [domainId, assessmentId] of Object.entries(
    domainAssessmentMapping
  )) {
    await prisma.domain.update({
      where: { id: domainId },
      data: {
        assessmentId: assessmentId,
      },
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
