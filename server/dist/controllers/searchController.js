"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const search = async (req, res) => {
    try {
        const q = req.query.q;
        if (!q || q.length < 2) {
            return res.json({ tours: [], destinations: [], experiences: [] });
        }
        const [tours, destinations, experiences] = await Promise.all([
            prisma_1.default.tour.findMany({
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
            prisma_1.default.destination.findMany({
                where: {
                    name: { contains: q },
                    tour: { isPublished: true }
                },
                take: 5,
                include: { tour: { select: { slug: true } } }
            }),
            prisma_1.default.experience.findMany({
                where: {
                    title: { contains: q },
                    tour: { isPublished: true }
                },
                take: 5,
                include: { tour: { select: { slug: true } } }
            })
        ]);
        res.json({ tours, destinations, experiences });
    }
    catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};
exports.search = search;
//# sourceMappingURL=searchController.js.map