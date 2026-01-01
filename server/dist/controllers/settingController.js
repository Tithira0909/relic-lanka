"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod");
const settingSchema = zod_1.z.object({
    siteName: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().optional(),
    contactEmail: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    socials: zod_1.z.array(zod_1.z.object({
        platform: zod_1.z.string(),
        url: zod_1.z.string().url()
    })).optional(),
});
// Public: Get Settings
const getSettings = async (req, res) => {
    try {
        let settings = await prisma_1.default.siteSetting.findFirst();
        if (!settings) {
            // Create default if not exists
            settings = await prisma_1.default.siteSetting.create({ data: {} });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};
exports.getSettings = getSettings;
// Admin: Update Settings
const updateSettings = async (req, res) => {
    try {
        const data = settingSchema.parse(req.body);
        let settings = await prisma_1.default.siteSetting.findFirst();
        if (settings) {
            settings = await prisma_1.default.siteSetting.update({
                where: { id: settings.id },
                data,
            });
        }
        else {
            settings = await prisma_1.default.siteSetting.create({ data: { ...data, socials: data.socials } });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
};
exports.updateSettings = updateSettings;
//# sourceMappingURL=settingController.js.map