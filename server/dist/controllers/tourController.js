"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminTourById = exports.deleteTour = exports.updateTour = exports.createTour = exports.getAdminTours = exports.getPublicTourBySlug = exports.getPublicTours = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod");
const slugify_1 = __importDefault(require("slugify"));
// Schemas
const tourSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    shortDescription: zod_1.z.string(),
    description: zod_1.z.string(),
    days: zod_1.z.number().int().min(1),
    nights: zod_1.z.number().int().min(0),
    inclusion: zod_1.z.array(zod_1.z.string()),
    includedActivities: zod_1.z.array(zod_1.z.string()),
    heroImageUrl: zod_1.z.string().optional(),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    isPublished: zod_1.z.boolean().optional(),
    itineraryDays: zod_1.z.array(zod_1.z.object({
        dayNumber: zod_1.z.number(),
        title: zod_1.z.string().optional(),
        routeText: zod_1.z.string().optional(),
        details: zod_1.z.string().optional(),
        sortOrder: zod_1.z.number().optional(),
    })).optional(),
    destinations: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().optional(), // for updates
        name: zod_1.z.string(),
        description: zod_1.z.string(),
        mapImageUrl: zod_1.z.string().optional().nullable(),
        routeImageUrl: zod_1.z.string().optional().nullable(),
        routeText: zod_1.z.string().optional().nullable(),
        sortOrder: zod_1.z.number().optional(),
        images: zod_1.z.array(zod_1.z.object({
            imageUrl: zod_1.z.string(),
            caption: zod_1.z.string().optional().nullable(),
            sortOrder: zod_1.z.number().optional(),
        })).optional()
    })).optional(),
    experiences: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().optional(), // for updates
        title: zod_1.z.string(),
        description: zod_1.z.string().optional().nullable(),
        adventureItems: zod_1.z.array(zod_1.z.string()),
        sortOrder: zod_1.z.number().optional(),
        images: zod_1.z.array(zod_1.z.object({
            imageUrl: zod_1.z.string(),
            caption: zod_1.z.string().optional().nullable(),
            sortOrder: zod_1.z.number().optional(),
        })).optional()
    })).optional()
});
// Public: Get all tours (paginated, published only)
const getPublicTours = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [tours, total] = await Promise.all([
            prisma_1.default.tour.findMany({
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
            prisma_1.default.tour.count({ where: { isPublished: true } })
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
};
exports.getPublicTours = getPublicTours;
// Public: Get tour by slug (full details)
const getPublicTourBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const tour = await prisma_1.default.tour.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
};
exports.getPublicTourBySlug = getPublicTourBySlug;
// Admin: Get all tours (including drafts)
const getAdminTours = async (req, res) => {
    try {
        const tours = await prisma_1.default.tour.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
};
exports.getAdminTours = getAdminTours;
// Admin: Create Tour
const createTour = async (req, res) => {
    try {
        const data = tourSchema.parse(req.body);
        const slug = (0, slugify_1.default)(data.name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
        const tour = await prisma_1.default.tour.create({
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
                        slug: (0, slugify_1.default)(dest.name, { lower: true, strict: true }),
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create tour' });
    }
};
exports.createTour = createTour;
// Admin: Update Tour
const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const data = tourSchema.parse(req.body);
        // Transaction for complex update
        await prisma_1.default.$transaction(async (tx) => {
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
            const incomingDestIds = data.destinations?.map(d => d.id).filter(Boolean) || [];
            // Delete missing
            const toDeleteDestIds = existingDestIds.filter(eid => !incomingDestIds.includes(eid));
            if (toDeleteDestIds.length > 0) {
                await tx.destination.deleteMany({ where: { id: { in: toDeleteDestIds } } });
            }
            // Upsert
            if (data.destinations) {
                for (const dest of data.destinations) {
                    const destSlug = (0, slugify_1.default)(dest.name, { lower: true, strict: true });
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
                    }
                    else {
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
            const incomingExpIds = data.experiences?.map(e => e.id).filter(Boolean) || [];
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
                    }
                    else {
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to update tour' });
    }
};
exports.updateTour = updateTour;
// Admin: Delete Tour
const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.tour.delete({ where: { id } });
        res.json({ message: 'Tour deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete tour' });
    }
};
exports.deleteTour = deleteTour;
// Admin: Get Single Tour for Edit
const getAdminTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await prisma_1.default.tour.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
};
exports.getAdminTourById = getAdminTourById;
//# sourceMappingURL=tourController.js.map