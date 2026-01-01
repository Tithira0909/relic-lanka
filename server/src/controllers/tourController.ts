import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';
import slugify from 'slugify';

// Schemas
const tourSchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string(),
  description: z.string(),
  days: z.number().int().min(1),
  nights: z.number().int().min(0),
  inclusion: z.array(z.string()),
  includedActivities: z.array(z.string()),
  heroImageUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().optional(),

  itineraryDays: z.array(z.object({
    dayNumber: z.number(),
    title: z.string().optional(),
    routeText: z.string().optional(),
    details: z.string().optional(),
    sortOrder: z.number().optional(),
  })).optional(),

  destinations: z.array(z.object({
    id: z.string().optional(), // for updates
    name: z.string(),
    description: z.string(),
    mapImageUrl: z.string().optional().nullable(),
    routeImageUrl: z.string().optional().nullable(),
    routeText: z.string().optional().nullable(),
    sortOrder: z.number().optional(),
    images: z.array(z.object({
      imageUrl: z.string(),
      caption: z.string().optional().nullable(),
      sortOrder: z.number().optional(),
    })).optional()
  })).optional(),

  experiences: z.array(z.object({
    id: z.string().optional(), // for updates
    title: z.string(),
    description: z.string().optional().nullable(),
    adventureItems: z.array(z.string()),
    sortOrder: z.number().optional(),
    images: z.array(z.object({
      imageUrl: z.string(),
      caption: z.string().optional().nullable(),
      sortOrder: z.number().optional(),
    })).optional()
  })).optional()
});

// Public: Get all tours (paginated, published only)
export const getPublicTours = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        where: { isPublished: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          days: true,
          nights: true,
          heroImageUrl: true,
        }
      }),
      prisma.tour.count({ where: { isPublished: true } })
    ]);

    res.json({
      data: tours,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
};

// Public: Get tour by slug (full details)
export const getPublicTourBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        destinations: {
          orderBy: { sortOrder: 'asc' },
          include: { images: { orderBy: { sortOrder: 'asc' } } }
        },
        experiences: {
          orderBy: { sortOrder: 'asc' },
          include: { images: { orderBy: { sortOrder: 'asc' } } }
        }
      }
    });

    if (!tour || (!tour.isPublished && req.user?.role !== 'ADMIN')) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
};

// Admin: Get all tours (including drafts)
export const getAdminTours = async (req: Request, res: Response) => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        days: true,
        nights: true,
        updatedAt: true,
      }
    });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
};

// Admin: Create Tour
export const createTour = async (req: Request, res: Response) => {
  try {
    const data = tourSchema.parse(req.body);
    const slug = slugify(data.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

    const tour = await prisma.tour.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        days: data.days,
        nights: data.nights,
        inclusion: data.inclusion,
        includedActivities: data.includedActivities,
        heroImageUrl: data.heroImageUrl,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        isPublished: data.isPublished || false,

        itineraryDays: {
          create: data.itineraryDays
        },
        destinations: {
          create: data.destinations?.map(dest => ({
            name: dest.name,
            slug: slugify(dest.name, { lower: true, strict: true }),
            description: dest.description,
            mapImageUrl: dest.mapImageUrl,
            routeImageUrl: dest.routeImageUrl,
            routeText: dest.routeText,
            sortOrder: dest.sortOrder,
            images: {
              create: dest.images
            }
          }))
        },
        experiences: {
          create: data.experiences?.map(exp => ({
            title: exp.title,
            description: exp.description,
            adventureItems: exp.adventureItems,
            sortOrder: exp.sortOrder,
            images: {
              create: exp.images
            }
          }))
        }
      }
    });

    res.status(201).json(tour);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create tour' });
  }
};

// Admin: Update Tour
export const updateTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = tourSchema.parse(req.body);

    // Transaction for complex update
    await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      await tx.tour.update({
        where: { id },
        data: {
          name: data.name,
          // slug: not updating slug to preserve SEO URLs usually, or maybe allow it? Let's keep it stable for now.
          shortDescription: data.shortDescription,
          description: data.description,
          days: data.days,
          nights: data.nights,
          inclusion: data.inclusion,
          includedActivities: data.includedActivities,
          heroImageUrl: data.heroImageUrl,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          isPublished: data.isPublished,
        }
      });

      // 2. Itinerary Days: Replace all (simplest for sortable lists)
      await tx.tourItineraryDay.deleteMany({ where: { tourId: id } });
      if (data.itineraryDays && data.itineraryDays.length > 0) {
        await tx.tourItineraryDay.createMany({
          data: data.itineraryDays.map(d => ({ ...d, tourId: id }))
        });
      }

      // 3. Destinations: "Smart" update is hard. We'll do a replace strategy for now to ensure consistency,
      // but this changes IDs. If that's okay.
      // Ideally we should track IDs from frontend to update existing ones.
      // Let's try to handle updates if ID is present.

      // Get existing IDs
      const existingDestinations = await tx.destination.findMany({ where: { tourId: id }, select: { id: true } });
      const existingDestIds = existingDestinations.map(d => d.id);
      const incomingDestIds = data.destinations?.map(d => d.id).filter(Boolean) as string[] || [];

      // Delete missing
      const toDeleteDestIds = existingDestIds.filter(eid => !incomingDestIds.includes(eid));
      if (toDeleteDestIds.length > 0) {
        await tx.destination.deleteMany({ where: { id: { in: toDeleteDestIds } } });
      }

      // Upsert
      if (data.destinations) {
        for (const dest of data.destinations) {
          const destSlug = slugify(dest.name, { lower: true, strict: true });
          let createdDest;

          if (dest.id && existingDestIds.includes(dest.id)) {
             createdDest = await tx.destination.update({
              where: { id: dest.id },
              data: {
                name: dest.name,
                description: dest.description,
                mapImageUrl: dest.mapImageUrl,
                routeImageUrl: dest.routeImageUrl,
                routeText: dest.routeText,
                sortOrder: dest.sortOrder,
              }
            });
            // Update images for this destination
            // Simplest: delete all images and recreate
            await tx.destinationImage.deleteMany({ where: { destinationId: dest.id } });
          } else {
             createdDest = await tx.destination.create({
              data: {
                tourId: id,
                name: dest.name,
                slug: destSlug,
                description: dest.description,
                mapImageUrl: dest.mapImageUrl,
                routeImageUrl: dest.routeImageUrl,
                routeText: dest.routeText,
                sortOrder: dest.sortOrder,
              }
            });
          }

          if (dest.images && dest.images.length > 0) {
            await tx.destinationImage.createMany({
              data: dest.images.map(img => ({
                destinationId: createdDest.id,
                imageUrl: img.imageUrl,
                caption: img.caption,
                sortOrder: img.sortOrder
              }))
            });
          }
        }
      }

      // 4. Experiences: Similar logic
      const existingExperiences = await tx.experience.findMany({ where: { tourId: id }, select: { id: true } });
      const existingExpIds = existingExperiences.map(e => e.id);
      const incomingExpIds = data.experiences?.map(e => e.id).filter(Boolean) as string[] || [];

      // Delete missing
      const toDeleteExpIds = existingExpIds.filter(eid => !incomingExpIds.includes(eid));
      if (toDeleteExpIds.length > 0) {
        await tx.experience.deleteMany({ where: { id: { in: toDeleteExpIds } } });
      }

      // Upsert
      if (data.experiences) {
        for (const exp of data.experiences) {
           let createdExp;
           if (exp.id && existingExpIds.includes(exp.id)) {
             createdExp = await tx.experience.update({
               where: { id: exp.id },
               data: {
                 title: exp.title,
                 description: exp.description,
                 adventureItems: exp.adventureItems,
                 sortOrder: exp.sortOrder
               }
             });
             await tx.experienceImage.deleteMany({ where: { experienceId: exp.id } });
           } else {
             createdExp = await tx.experience.create({
               data: {
                 tourId: id,
                 title: exp.title,
                 description: exp.description,
                 adventureItems: exp.adventureItems,
                 sortOrder: exp.sortOrder
               }
             });
           }

           if (exp.images && exp.images.length > 0) {
             await tx.experienceImage.createMany({
               data: exp.images.map(img => ({
                 experienceId: createdExp.id,
                 imageUrl: img.imageUrl,
                 caption: img.caption,
                 sortOrder: img.sortOrder
               }))
             });
           }
        }
      }

    });

    res.json({ message: 'Tour updated successfully' });
  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to update tour' });
  }
};

// Admin: Delete Tour
export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.tour.delete({ where: { id } });
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tour' });
  }
};

// Admin: Get Single Tour for Edit
export const getAdminTourById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        destinations: {
          orderBy: { sortOrder: 'asc' },
          include: { images: { orderBy: { sortOrder: 'asc' } } }
        },
        experiences: {
          orderBy: { sortOrder: 'asc' },
          include: { images: { orderBy: { sortOrder: 'asc' } } }
        }
      }
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
};
