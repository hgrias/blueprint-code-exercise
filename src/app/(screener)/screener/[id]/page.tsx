import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { screenerSchema } from "../../api/screener/types";
import ScreenerQuestionnaire from "../components/screener-questionnaire";

export default async function ScreenerPage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = new PrismaClient();

  try {
    const rawScreener = await prisma.screener.findUnique({
      where: { id: params.id },
    });

    if (!rawScreener) {
      notFound();
    }

    // Parse the screener object using the zod schema
    const screener = screenerSchema.parse(rawScreener);

    if (!screener) {
      notFound();
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="w-full max-w-2xl">
          <ScreenerQuestionnaire screener={screener} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch screener:", error);
    throw new Error("Failed to load screener");
  } finally {
    await prisma.$disconnect();
  }
}
