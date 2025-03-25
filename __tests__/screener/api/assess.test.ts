import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { POST } from "@/app/(screener)/api/screener/assess/route";

// Mock the database
jest.mock("@/server/db", () => ({
  db: {
    domain: {
      findMany: jest.fn(),
    },
  },
}));

describe("POST Screener Assess API Route", () => {
  const mockDomains = [
    {
      id: "domain1",
      name: "Depression",
      threshold: 2,
      assessmentId: "depression-assessment",
      questions: [{ id: "q1" }, { id: "q2" }],
    },
    {
      id: "domain2",
      name: "Anxiety",
      threshold: 3,
      assessmentId: "anxiety-assessment",
      questions: [{ id: "q3" }, { id: "q4" }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cached domain mappings
    (global as any).cachedDomainMappings = null;
  });

  it("should compute assessments correctly", async () => {
    // Mock domain data
    (db.domain.findMany as jest.Mock).mockResolvedValue(mockDomains);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        answers: [
          { question_id: "q1", value: 3 },
          { question_id: "q2", value: 2 },
          { question_id: "q3", value: 1 },
        ],
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.results).toEqual(["depression-assessment"]);
  });

  it("should return 400 for invalid answers", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        answers: [
          { question_id: "", value: 5 }, // Invalid question_id and value
        ],
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe("Invalid request body");
  });

  it("should throw error for unmapped question", async () => {
    // Mock domain data
    (db.domain.findMany as jest.Mock).mockResolvedValue(mockDomains);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        answers: [{ question_id: "unmapped-question", value: 3 }],
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe("Failed to compute assessments for screener");
  });
});
