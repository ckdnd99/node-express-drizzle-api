import type { Request, Response } from "express";
import { db } from "../db";
import { productsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getUserIdFromSession } from "../utils/getSession";

// 🛡️ Helper: Get user from session token
async function getUserFromSession(req: Request): Promise<string | null> {
  const sessionToken = req.cookies?.session_token;
  if (!sessionToken) return null;
  return await getUserIdFromSession(sessionToken);
}

// ✅ Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  salePrice: z.number().min(0),
  mrpPrice: z.number().min(0),
  stock: z.number().int().min(0),
});

// 📦 Get all products
export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await db.select().from(productsTable);
    res.json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// ➕ Create product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = await getUserFromSession(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(422)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { name, salePrice, mrpPrice, stock } = parsed.data;

  try {
    await db.insert(productsTable).values({
      name: parsed.data.name,
      salePrice: parsed.data.salePrice.toString(),
      mrpPrice: parsed.data.mrpPrice.toString(),
      stock: parsed.data.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Product created" });
  } catch (error) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

// ✏️ Update product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = await getUserFromSession(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ success: false, message: "Invalid product ID" });
    return;
  }

  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    await db
      .update(productsTable)
      .set({
        ...parsed.data,
        salePrice: parsed.data.salePrice.toString(),
        mrpPrice: parsed.data.mrpPrice.toString(),
        updatedAt: new Date()
      })
      .where(eq(productsTable.id, id as string));

    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// ❌ Delete product
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = await getUserFromSession(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ success: false, message: "Invalid product ID" });
    return;
  }

  try {
    await db
      .delete(productsTable)
      .where(eq(productsTable.id, id as string));

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};
