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
