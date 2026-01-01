"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePage = exports.getAdminPages = exports.getPageByKey = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod");
const pageSchema = zod_1.z.object({
    title: zod_1.z.string(),
    contentHtml: zod_1.z.string(),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
});
// Public: Get page by key
const getPageByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const page = await prisma_1.default.page.findUnique({
            where: { key: key.toUpperCase() },
        });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch page' });
    }
};
exports.getPageByKey = getPageByKey;
// Admin: Get all pages
const getAdminPages = async (req, res) => {
    try {
        const pages = await prisma_1.default.page.findMany();
        res.json(pages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};
exports.getAdminPages = getAdminPages;
// Admin: Update page
const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const data = pageSchema.partial().parse(req.body);
        const page = await prisma_1.default.page.update({
            where: { id },
            data,
        });
        res.json(page);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update page' });
    }
};
exports.updatePage = updatePage;
//# sourceMappingURL=pageController.js.map