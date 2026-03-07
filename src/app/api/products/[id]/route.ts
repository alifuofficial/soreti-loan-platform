import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireRole,
  requireMinRole,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";

// Validation schema for updating a product
const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().optional().nullable(),
  shortDesc: z.string().max(200).optional().nullable(),
  price: z.number().positive("Price must be positive").optional(),
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

// GET /api/products/[id] - Get product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if id is a slug or cuid
    const isSlug = !id.startsWith("cl");
    
    const product = await db.product.findFirst({
      where: isSlug ? { slug: id } : { id },
      include: {
        _count: {
          select: {
            loans: true,
          },
        },
      },
    });

    if (!product) {
      return notFoundResponse("Product not found");
    }

    // Parse images JSON if exists
    const productData = {
      ...product,
      images: product.images ? JSON.parse(product.images) : null,
    };

    return successResponse(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse("Failed to fetch product", 500);
  }
}

// PUT /api/products/[id] - Update product (admin/seller)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireRole(["ADMIN", "SUPER_ADMIN", "SELLER"]);
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid product ID");
    }

    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    // If name is being updated, update slug
    let slug = existingProduct.slug;
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      const baseSlug = generateSlug(validatedData.name);
      slug = baseSlug;
      let counter = 1;

      while (true) {
        const existing = await db.product.findFirst({
          where: { slug, NOT: { id } },
        });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Check SKU uniqueness if being updated
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const duplicateSku = await db.product.findFirst({
        where: { sku: validatedData.sku, NOT: { id } },
      });
      if (duplicateSku) {
        return errorResponse("Product with this SKU already exists");
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name, slug }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.shortDesc !== undefined && { shortDesc: validatedData.shortDesc }),
        ...(validatedData.price !== undefined && { price: validatedData.price }),
        ...(validatedData.category !== undefined && { category: validatedData.category }),
        ...(validatedData.imageUrl !== undefined && { imageUrl: validatedData.imageUrl }),
        ...(validatedData.images !== undefined && { images: validatedData.images ? JSON.stringify(validatedData.images) : null }),
        ...(validatedData.inventory !== undefined && { inventory: validatedData.inventory }),
        ...(validatedData.sku !== undefined && { sku: validatedData.sku }),
        ...(validatedData.isFinanceable !== undefined && { isFinanceable: validatedData.isFinanceable }),
        ...(validatedData.minDownPayment !== undefined && { minDownPayment: validatedData.minDownPayment }),
        ...(validatedData.maxLoanTerm !== undefined && { maxLoanTerm: validatedData.maxLoanTerm }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
        ...(validatedData.isFeatured !== undefined && { isFeatured: validatedData.isFeatured }),
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: product.id,
      description: `Updated product: ${product.name}`,
      oldValue: JSON.stringify(existingProduct),
      newValue: JSON.stringify(product),
      ...clientInfo,
      route: `/api/products/${id}`,
      method: "PUT",
    });

    return successResponse(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error updating product:", error);
    return errorResponse("Failed to update product", 500);
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireMinRole("ADMIN");
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid product ID");
    }

    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return notFoundResponse("Product not found");
    }

    // Check if product has loans
    const loansCount = await db.loanApplication.count({
      where: { productId: id },
    });

    if (loansCount > 0) {
      // Soft delete - just deactivate
      const product = await db.product.update({
        where: { id },
        data: { isActive: false },
      });

      const clientInfo = getClientInfo(request);
      await createAuditLog(authResult.id, {
        action: "PRODUCT_DEACTIVATED",
        entityType: "Product",
        entityId: product.id,
        description: `Deactivated product: ${product.name} - had ${loansCount} loan applications`,
        oldValue: JSON.stringify(existingProduct),
        newValue: JSON.stringify(product),
        ...clientInfo,
        route: `/api/products/${id}`,
        method: "DELETE",
      });

      return successResponse({ 
        message: "Product deactivated successfully (had loan applications)",
        product 
      });
    }

    // Hard delete if no loans
    await db.product.delete({ where: { id } });

    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "PRODUCT_DELETED",
      entityType: "Product",
      entityId: id,
      description: `Deleted product: ${existingProduct.name}`,
      oldValue: JSON.stringify(existingProduct),
      ...clientInfo,
      route: `/api/products/${id}`,
      method: "DELETE",
    });

    return successResponse({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return errorResponse("Failed to delete product", 500);
  }
}
