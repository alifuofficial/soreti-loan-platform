import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireMinRole,
  paginationSchema,
} from "@/lib/api-utils";

// GET /api/audit-logs - List audit logs (admin only, with filtering)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireMinRole("ADMIN");
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    
    // Parse pagination
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
    });

    // Parse filters
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (action) {
      where.action = { contains: action };
    }
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (entityId) {
      where.entityId = entityId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        (where.timestamp as Record<string, unknown>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.timestamp as Record<string, unknown>).lte = new Date(endDate);
      }
    }

    // Get total count
    const total = await db.auditLog.count({ where });

    // Get audit logs
    const logs = await db.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return successResponse({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return errorResponse("Failed to fetch audit logs", 500);
  }
}
