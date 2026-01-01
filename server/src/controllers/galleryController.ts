import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';

const galleryItemSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  imageUrl: z.string().min(1),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Public: Get active gallery items
export const getPublicGallery = async (req: Request, res: Response) => {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// Admin: Get all gallery items
export const getAdminGallery = async (req: Request, res: Response) => {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// Admin: Create item
export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const data = galleryItemSchema.parse(req.body);
    const item = await prisma.galleryItem.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// Admin: Update item
export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = galleryItemSchema.partial().parse(req.body);
    const item = await prisma.galleryItem.update({
      where: { id },
      data,
    });
    res.json(item);
  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Admin: Delete item
export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
