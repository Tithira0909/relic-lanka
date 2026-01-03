import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';

const experienceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  adventureItems: z.array(z.string()),
  sortOrder: z.number().optional(),
  tourId: z.string().optional().nullable(),
  images: z.array(z.object({
    imageUrl: z.string(),
    caption: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
  })).optional()
});

export const getAdminExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        tour: { select: { name: true } },
        images: true
      }
    });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });

    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const data = experienceSchema.parse(req.body);

    const experience = await prisma.experience.create({
      data: {
        title: data.title,
        description: data.description,
        adventureItems: data.adventureItems,
        sortOrder: data.sortOrder,
        tourId: data.tourId,
        images: {
          create: data.images
        }
      }
    });
    res.status(201).json(experience);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to create experience' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = experienceSchema.parse(req.body);

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        adventureItems: data.adventureItems,
        sortOrder: data.sortOrder,
        tourId: data.tourId,
      }
    });

    if (data.images) {
        await prisma.experienceImage.deleteMany({ where: { experienceId: id } });
        if (data.images.length > 0) {
            await prisma.experienceImage.createMany({
                data: data.images.map(img => ({
                    experienceId: id,
                    imageUrl: img.imageUrl,
                    caption: img.caption,
                    sortOrder: img.sortOrder
                }))
            });
        }
    }

    res.json(experience);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};
