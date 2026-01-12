import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';
import slugify from 'slugify';

const destinationSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  mapImageUrl: z.string().optional().nullable(),
  routeImageUrl: z.string().optional().nullable(),
  routeText: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
  tourId: z.string().optional().nullable(),
  images: z.array(z.object({
    imageUrl: z.string(),
    caption: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
  })).optional()
});

export const getAdminDestinations = async (req: Request, res: Response) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        tour: { select: { name: true } },
        images: true
      }
    });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } }
    });
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const data = destinationSchema.parse(req.body);
    const slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

    const destination = await prisma.destination.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        mapImageUrl: data.mapImageUrl,
        routeImageUrl: data.routeImageUrl,
        routeText: data.routeText,
        sortOrder: data.sortOrder,
        tourId: data.tourId,
        images: {
          create: data.images
        }
      }
    });
    res.status(201).json(destination);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to create destination' });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = destinationSchema.parse(req.body);

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        mapImageUrl: data.mapImageUrl,
        routeImageUrl: data.routeImageUrl,
        routeText: data.routeText,
        sortOrder: data.sortOrder,
        tourId: data.tourId,
      }
    });

    // Handle Images separately (replace strategy for simplicity or append?)
    // The user wants "multiple images should be able to included".
    // Usually in update, we might want to add new ones or remove old ones.
    // For simplicity, if `images` is provided, we replace all?
    // Or we rely on a separate endpoint/logic.
    // Let's go with: If `images` is in payload, replace.
    if (data.images) {
        await prisma.destinationImage.deleteMany({ where: { destinationId: id } });
        if (data.images.length > 0) {
            await prisma.destinationImage.createMany({
                data: data.images.map(img => ({
                    destinationId: id,
                    imageUrl: img.imageUrl,
                    caption: img.caption,
                    sortOrder: img.sortOrder
                }))
            });
        }
    }

    res.json(destination);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to update destination' });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });
    res.json({ message: 'Destination deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
};
