import { PrismaClient } from "@prisma/client";
import domainMapping from "../src/data/domain-mapping.json";
import sampleQuestions from "../src/data/sample-questions.json";

const prisma = new PrismaClient();

async function main() {
  // Extract unique domains from domain mapping
  const uniqueDomains = [
    ...new Set(domainMapping.map((mapping) => mapping.domain)),
  ];

  // Create domains
  for (const domainName of uniqueDomains) {
    await prisma.domain.upsert({
      where: { id: domainName },
      update: {},
      create: {
        id: domainName,
        name:
          domainName.charAt(0).toUpperCase() +
          domainName.slice(1).replace("_", " "),
      },
    });
  }

  // Create questions
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
