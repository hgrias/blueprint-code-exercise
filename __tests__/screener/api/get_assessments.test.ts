import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { POST } from "@/app/api/assessments/route";

// Mock the database
jest.mock("@/server/db", () => ({
  db: {
    assessment: {
      findMany: jest.fn(),
    },
  },
}));

describe("POST Assessments API Route", () => {
  const mockAssessmentIds = ["assessment1", "assessment2"];
  const mockAssessments = [
    { id: "assessment1", name: "Assessment One" },
    { id: "assessment2", name: "Assessment Two" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return assessments successfully", async () => {
    // Mock successful database lookup
    (db.assessment.findMany as jest.Mock).mockResolvedValue(mockAssessments);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ assessmentIds: mockAssessmentIds }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(mockAssessments);
    expect(db.assessment.findMany).toHaveBeenCalledWith({
      where: { id: { in: mockAssessmentIds } },
    });
  });

  it("should return 400 for empty assessment IDs", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ assessmentIds: [] }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe("Invalid request body");
  });

  it("should return 404 when some assessments are not found", async () => {
    // Mock partial assessment lookup
    (db.assessment.findMany as jest.Mock).mockResolvedValue([
      mockAssessments[0],
    ]);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ assessmentIds: mockAssessmentIds }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.error).toBe("Some assessments not found");
    expect(result.details).toEqual(["assessment2"]);
  });

  it("should handle database connection errors", async () => {
    // Mock database connection error
    (db.assessment.findMany as jest.Mock).mockRejectedValue(
      new Error("Connection failed")
    );

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ assessmentIds: mockAssessmentIds }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(503);
    expect(result.error).toBe("Database connection error");
  });
});
