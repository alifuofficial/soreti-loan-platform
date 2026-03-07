import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/security";

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  marketingConsent: z.boolean().optional(),
  // UTM params
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

// Helper to format password validation errors
function formatPasswordErrors(errors: Record<string, string[]>): string {
  const passwordErrors = errors.password || [];
  if (passwordErrors.length > 0) {
    const requirements: string[] = [];
    passwordErrors.forEach(err => {
      if (err.includes('8 characters')) requirements.push('at least 8 characters');
      if (err.includes('uppercase')) requirements.push('one uppercase letter (A-Z)');
      if (err.includes('lowercase')) requirements.push('one lowercase letter (a-z)');
      if (err.includes('number')) requirements.push('one number (0-9)');
    });
    return `Weak password. Please include: ${requirements.join(', ')}. Change your password and try again.`;
  }
  return Object.values(errors).flat().join('. ');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 requests per 15 minutes per IP
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`register:${clientIp}`, { interval: 900000, limit: 5 })
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many registration attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 900),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          }
        }
      )
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors as Record<string, string[]>;
      const formattedError = formatPasswordErrors(fieldErrors);
      return NextResponse.json(
        {
          success: false,
          error: formattedError,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { 
      email, 
      password, 
      fullName, 
      phone,
      dateOfBirth,
      marketingConsent,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Check if phone is already used (if provided)
    if (phone) {
      const existingPhone = await db.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this phone number already exists",
          },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with marketing attribution
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        role: "CUSTOMER",
        isActive: true,
        authProvider: "credentials",
        // Marketing attribution
        utmSource: utm_source || null,
        utmMedium: utm_medium || null,
        utmCampaign: utm_campaign || null,
        utmTerm: utm_term || null,
        utmContent: utm_content || null,
        firstVisitAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        entityType: "User",
        entityId: user.id,
        description: `New user registered: ${user.email}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Log detailed error server-side
    console.error("Registration error:", error);
    
    // Return generic message to client (no internal details exposed)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during registration. Please try again later.",
      },
      { status: 500 }
    );
  }
}
