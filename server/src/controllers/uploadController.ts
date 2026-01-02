import { Request, Response } from 'express';
import { ENV } from '../utils/env';

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  let fileUrl: string;

  // Check if S3 was used (multer-s3 adds 'location' property)
  const fileWithLocation = req.file as any;

  if (fileWithLocation.location) {
    fileUrl = fileWithLocation.location;
    // Handle Cloudflare R2 or other S3 compatible public URLs if needed
    if (ENV.S3_PUBLIC_URL) {
        // Replace endpoint with public URL if specified
        // This is a simple replacement logic, might need adjustment based on specific provider URL structure
        const filename = fileWithLocation.key;
        fileUrl = `${ENV.S3_PUBLIC_URL}/${filename}`;
    }
  } else {
    // Local storage
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  res.json({ url: fileUrl });
};
