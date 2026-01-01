import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) {
      return res.json({ tours: [], destinations: [], experiences: [] });
    }

    const [tours, destinations, experiences] = await Promise.all([
      prisma.tour.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: q } }, // Case insensitive in MySQL usually
            { shortDescription: { contains: q } }
          ]
        },
        take: 5,
        select: { id: true, name: true, slug: true, heroImageUrl: true }
      }),
      prisma.destination.findMany({
        where: {
          name: { contains: q },
          tour: { isPublished: true }
        },
        take: 5,
        include: { tour: { select: { slug: true } } }
      }),
      prisma.experience.findMany({
        where: {
          title: { contains: q },
          tour: { isPublished: true }
        },
        take: 5,
        include: { tour: { select: { slug: true } } }
      })
    ]);

    res.json({ tours, destinations, experiences });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};
