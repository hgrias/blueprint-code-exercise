import { NextRequest, NextResponse } from "next/server";
import { Answer } from "./types";

export async function POST(request: NextRequest) {
  const { answers } = (await request.json()) as Answer[];

  return NextResponse.json({
    results: [],
  });
}
