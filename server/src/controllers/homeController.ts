import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get Featured Destinations (Places)
// We'll pick the first 6 destinations from the database.
// In a real app, we might have a 'isFeatured' flag, but for now, any destination works.
export const getHomeDestinations = async (req: Request, res: Response) => {
  try {
    const limit = 6;
    const destinations = await prisma.destination.findMany({
      take: limit,
      orderBy: { sortOrder: 'asc' }, // or createdAt if available, but sortOrder is good
      include: {
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' }
        },
        tour: {
            select: { slug: true } // needed to link to the parent tour
        }
      }
    });

    res.json(destinations);
  } catch (error) {
    console.error('Error fetching home destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

// Get Featured Experiences
export const getHomeExperiences = async (req: Request, res: Response) => {
  try {
    const limit = 6;
    const experiences = await prisma.experience.findMany({
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' }
        },
        tour: {
            select: { slug: true }
        }
      }
    });

    res.json(experiences);
  } catch (error) {
    console.error('Error fetching home experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};
