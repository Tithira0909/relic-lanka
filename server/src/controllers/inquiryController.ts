import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';
// import { sendEmail } from '../utils/email'; // Placeholder

const inquirySchema = z.object({
  type: z.enum(['TOUR', 'GENERAL']),
  tourId: z.string().optional().nullable(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  travelDates: z.string().optional(),
  travelersCount: z.number().optional(),
  message: z.string().min(1),
});

// Public: Create inquiry
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const data = inquirySchema.parse(req.body);

    const inquiry = await prisma.inquiry.create({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
};

// Admin: Get Inquiries (Paginated)
export const getAdminInquiries = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { tour: { select: { name: true } } }
      }),
      prisma.inquiry.count()
    ]);

    res.json({
      data: inquiries,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

// Admin: Update Inquiry Status/Notes
export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status,
        adminNotes
      }
    });

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
};
