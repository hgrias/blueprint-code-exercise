import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { GET } from "@/app/(screener)/api/screener/[id]/route";

// Mock the database
jest.mock("@/server/db", () => ({
  db: {
    screener: {
      findUnique: jest.fn(),
    },
  },
}));

describe("GET Screener API Route", () => {
  const mockScreenerId = "test-screener-id";
  const mockScreener = {
    id: mockScreenerId,
    name: "Test Screener",
    disorder: "Test Disorder",
    fullName: "Full Test Screener Name",
    content: {
      sections: [],
      display_name: "Test Display Name",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return screener successfully when found", async () => {
    // Mock successful database lookup
    (db.screener.findUnique as jest.Mock).mockResolvedValue(mockScreener);

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { id: mockScreenerId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(mockScreener);
    expect(db.screener.findUnique).toHaveBeenCalledWith({
      where: { id: mockScreenerId },
    });
  });

  it("should return 404 when screener is not found", async () => {
    // Mock no screener found
    (db.screener.findUnique as jest.Mock).mockResolvedValue(null);

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { id: mockScreenerId } });
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.error).toBe("Screener not found");
  });

  it("should return 400 for invalid screener ID", async () => {
    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { id: "" } });
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe("Invalid screener ID");
  });

  it("should handle database connection errors", async () => {
    // Mock database connection error
    (db.screener.findUnique as jest.Mock).mockRejectedValue(
      new Error("Connection failed")
    );

    const mockRequest = {} as NextRequest;
    const response = await GET(mockRequest, { params: { id: mockScreenerId } });
    const result = await response.json();

    expect(response.status).toBe(503);
    expect(result.error).toBe("Database connection error");
  });
});
