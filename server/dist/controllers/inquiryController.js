"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInquiry = exports.getAdminInquiries = exports.createInquiry = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const zod_1 = require("zod");
// import { sendEmail } from '../utils/email'; // Placeholder
const inquirySchema = zod_1.z.object({
    type: zod_1.z.enum(['TOUR', 'GENERAL']),
    tourId: zod_1.z.string().optional().nullable(),
    fullName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    whatsapp: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    travelDates: zod_1.z.string().optional(),
    travelersCount: zod_1.z.number().optional(),
    message: zod_1.z.string().min(1),
});
// Public: Create inquiry
const createInquiry = async (req, res) => {
    try {
        const data = inquirySchema.parse(req.body);
        const inquiry = await prisma_1.default.inquiry.create({
            data: {
                type: data.type,
                tourId: data.tourId,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                country: data.country,
                travelDates: data.travelDates,
                travelersCount: data.travelersCount,
                message: data.message,
            }
        });
        // TODO: Send emails (Admin notification + Auto-reply)
        // await sendEmail(...)
        res.status(201).json({ message: 'Inquiry received', id: inquiry.id });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
};
exports.createInquiry = createInquiry;
// Admin: Get Inquiries (Paginated)
const getAdminInquiries = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [inquiries, total] = await Promise.all([
            prisma_1.default.inquiry.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { tour: { select: { name: true } } }
            }),
            prisma_1.default.inquiry.count()
        ]);
        res.json({
            data: inquiries,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
};
exports.getAdminInquiries = getAdminInquiries;
// Admin: Update Inquiry Status/Notes
const updateInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        const inquiry = await prisma_1.default.inquiry.update({
            where: { id },
            data: {
                status,
                adminNotes
            }
        });
        res.json(inquiry);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
};
exports.updateInquiry = updateInquiry;
//# sourceMappingURL=inquiryController.js.map