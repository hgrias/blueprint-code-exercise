import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function ScreenerPage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = new PrismaClient();

  try {
    const screener = await prisma.screener.findUnique({
      where: { id: params.id },
    });

    if (!screener) {
      notFound();
    }

    return (
      <div>
        <h1>{screener.fullName}</h1>
        {/* TODO: Implement screener UI */}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch screener:", error);
    throw new Error("Failed to load screener");
  } finally {
    await prisma.$disconnect();
  }
}
