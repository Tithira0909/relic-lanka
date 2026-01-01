"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItem = exports.updateGalleryItem = exports.createGalleryItem = exports.getAdminGallery = exports.getPublicGallery = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod");
const galleryItemSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    caption: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().min(1),
    sortOrder: zod_1.z.number().int().default(0),
    isActive: zod_1.z.boolean().default(true),
});
// Public: Get active gallery items
const getPublicGallery = async (req, res) => {
    try {
        const items = await prisma_1.default.galleryItem.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
};
exports.getPublicGallery = getPublicGallery;
// Admin: Get all gallery items
const getAdminGallery = async (req, res) => {
    try {
        const items = await prisma_1.default.galleryItem.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
};
exports.getAdminGallery = getAdminGallery;
// Admin: Create item
const createGalleryItem = async (req, res) => {
    try {
        const data = galleryItemSchema.parse(req.body);
        const item = await prisma_1.default.galleryItem.create({ data });
        res.status(201).json(item);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create item' });
    }
};
exports.createGalleryItem = createGalleryItem;
// Admin: Update item
const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const data = galleryItemSchema.partial().parse(req.body);
        const item = await prisma_1.default.galleryItem.update({
            where: { id },
            data,
        });
        res.json(item);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to update item' });
    }
};
exports.updateGalleryItem = updateGalleryItem;
// Admin: Delete item
const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.galleryItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
exports.deleteGalleryItem = deleteGalleryItem;
//# sourceMappingURL=galleryController.js.map