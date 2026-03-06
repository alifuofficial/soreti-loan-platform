import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// OAuth Providers API - Manage social login providers
// Using direct PrismaClient to avoid module caching issues

const getPrismaClient = () => {
  return new PrismaClient();
};

// GET - Fetch all OAuth providers (public info only)
export async function GET(request: NextRequest) {
  const prisma = getPrismaClient();
  
  try {
    const providers = await prisma.oAuthProvider.findMany({
      where: { isEnabled: true },
      select: {
        name: true,
        displayName: true,
        isEnabled: true,
        buttonColor: true,
        buttonTextColor: true,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json({ providers });
  } catch (error) {
    console.error("Failed to fetch OAuth providers:", error);
    await prisma.$disconnect();
    return NextResponse.json(
      { providers: [] },
      { status: 200 }
    );
  }
}

// POST - Create or update OAuth provider (admin only)
export async function POST(request: NextRequest) {
  const prisma = getPrismaClient();
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, displayName, clientId, clientSecret, isEnabled, buttonColor, buttonTextColor, botToken } = body;

    if (!name || !displayName) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Name and displayName are required" },
        { status: 400 }
      );
    }

    const provider = await prisma.oAuthProvider.upsert({
      where: { name },
      update: {
        displayName,
        clientId,
        clientSecret,
        isEnabled: isEnabled ?? true,
        buttonColor,
        buttonTextColor,
        botToken,
      },
      create: {
        name,
        displayName,
        clientId,
        clientSecret,
        isEnabled: isEnabled ?? true,
        buttonColor,
        buttonTextColor,
        botToken,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json({ success: true, provider });
  } catch (error) {
    console.error("Failed to update OAuth provider:", error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: "Failed to update OAuth provider" },
      { status: 500 }
    );
  }
}
