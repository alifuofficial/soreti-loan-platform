import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireRole,
  createAuditLog,
  getClientInfo,
  paginationSchema,
} from "@/lib/api-utils";

// Validation schema for creating a product
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  shortDesc: z.string().max(200).optional().nullable(),
  price: z.number().positive("Price must be positive"),
  category: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable(),
  inventory: z.number().int().min(0).optional(),
  sku: z.string().optional().nullable(),
  isFinanceable: z.boolean().optional(),
  minDownPayment: z.number().min(0).max(100).optional().nullable(),
  maxLoanTerm: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/products - List products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
    });

    // Parse filters
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const financeable = searchParams.get("financeable");
    const includeInactive = searchParams.get("includeInactive") === "true";

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured === "true") {
      where.isFeatured = true;
    }
    
    if (financeable === "true") {
      where.isFinanceable = true;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
      }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDesc: { contains: search } },
      ];
    }

    // Get total count
    const total = await db.product.count({ where });

    // Get products
    const products = await db.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDesc: true,
        price: true,
        category: true,
        imageUrl: true,
        isFinanceable: true,
        minDownPayment: true,
        maxLoanTerm: true,
        isActive: true,
        isFeatured: true,
        createdAt: true,
      },
    });

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse("Failed to fetch products", 500);
  }
}

// POST /api/products - Create product (admin/seller)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(["ADMIN", "SUPER_ADMIN", "SELLER"]);
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate slug
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Check SKU uniqueness if provided
    if (validatedData.sku) {
      const existingSku = await db.product.findUnique({
        where: { sku: validatedData.sku },
      });
      if (existingSku) {
        return errorResponse("Product with this SKU already exists");
      }
    }

    const product = await db.product.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        shortDesc: validatedData.shortDesc,
        price: validatedData.price,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl,
        images: validatedData.images ? JSON.stringify(validatedData.images) : null,
        inventory: validatedData.inventory ?? 0,
        sku: validatedData.sku,
        isFinanceable: validatedData.isFinanceable ?? true,
        minDownPayment: validatedData.minDownPayment,
        maxLoanTerm: validatedData.maxLoanTerm,
        isActive: validatedData.isActive ?? true,
        isFeatured: validatedData.isFeatured ?? false,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      description: `Created product: ${product.name}`,
      newValue: JSON.stringify(product),
      ...clientInfo,
      route: "/api/products",
      method: "POST",
    });

    return successResponse(product, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error creating product:", error);
    return errorResponse("Failed to create product", 500);
  }
}
