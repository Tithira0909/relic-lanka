import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';

const pageSchema = z.object({
  title: z.string(),
  contentHtml: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// Public: Get page by key
export const getPageByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const page = await prisma.page.findUnique({
      where: { key: key.toUpperCase() },
    });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// Admin: Get all pages
export const getAdminPages = async (req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// Admin: Update page
export const updatePage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = pageSchema.partial().parse(req.body);
    const page = await prisma.page.update({
      where: { id },
      data,
    });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
};
