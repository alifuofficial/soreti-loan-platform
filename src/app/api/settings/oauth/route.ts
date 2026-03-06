import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// OAuth providers list endpoint - Returns enabled social login providers
export async function GET() {
  try {
    const providers = await db.oAuthProvider.findMany({
      where: { isEnabled: true },
      select: {
        name: true,
        displayName: true,
        isEnabled: true,
        buttonColor: true,
        buttonTextColor: true,
      },
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("OAuth providers error:", error);
    // Return empty array on error - social buttons will still show in dev mode
    return NextResponse.json({ providers: [] });
  }
}
