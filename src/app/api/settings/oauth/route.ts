import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Fetch OAuth providers
// Public endpoint returns only enabled providers
// Admin endpoint returns all providers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && ['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER'].includes(session.user.role);
    
    // Admin can see all providers, public only sees enabled ones
    const providers = await db.oAuthProvider.findMany({
      where: isAdmin ? {} : { isEnabled: true },
      select: {
        id: true,
        name: true,
        displayName: true,
        isEnabled: true,
        buttonColor: true,
        buttonTextColor: true,
        clientId: isAdmin, // Only admin can see client IDs
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error("OAuth providers error:", error);
    return NextResponse.json({ providers: [] });
  }
}

// PUT - Update OAuth provider settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isEnabled, clientId, clientSecret, buttonColor, buttonTextColor, botToken } = body;

    if (!id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (typeof isEnabled === 'boolean') updateData.isEnabled = isEnabled;
    if (clientId !== undefined) updateData.clientId = clientId;
    if (clientSecret !== undefined) updateData.clientSecret = clientSecret;
    if (buttonColor !== undefined) updateData.buttonColor = buttonColor;
    if (buttonTextColor !== undefined) updateData.buttonTextColor = buttonTextColor;
    if (botToken !== undefined) updateData.botToken = botToken;

    const provider = await db.oAuthProvider.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ provider });
  } catch (error) {
    console.error("OAuth update error:", error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}

// POST - Create or update OAuth provider (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, displayName, isEnabled, clientId, clientSecret, buttonColor, buttonTextColor, botToken } = body;

    if (!name) {
      return NextResponse.json({ error: 'Provider name is required' }, { status: 400 });
    }

    const provider = await db.oAuthProvider.upsert({
      where: { name },
      create: {
        name,
        displayName: displayName || name.charAt(0).toUpperCase() + name.slice(1),
        isEnabled: isEnabled ?? false,
        clientId,
        clientSecret,
        buttonColor,
        buttonTextColor,
        botToken,
      },
      update: {
        displayName,
        isEnabled,
        clientId,
        clientSecret,
        buttonColor,
        buttonTextColor,
        botToken,
      },
    });

    return NextResponse.json({ provider });
  } catch (error) {
    console.error("OAuth create/update error:", error);
    return NextResponse.json({ error: 'Failed to create/update provider' }, { status: 500 });
  }
}
