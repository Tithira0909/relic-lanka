import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { z } from 'zod';

const settingSchema = z.object({
  siteName: z.string().optional(),
  logoUrl: z.string().optional(),
  contactEmail: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  socials: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  })).optional(),
});

// Public: Get Settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      // Create default if not exists
      settings = await prisma.siteSetting.create({ data: {} });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Admin: Update Settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = settingSchema.parse(req.body);
    let settings = await prisma.siteSetting.findFirst();

    if (settings) {
      settings = await prisma.siteSetting.update({
        where: { id: settings.id },
        data: {
          ...data,
          socials: data.socials ? data.socials : undefined
        },
      });
    } else {
      settings = await prisma.siteSetting.create({
        data: {
          ...data,
          socials: data.socials ? data.socials : undefined
        }
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
