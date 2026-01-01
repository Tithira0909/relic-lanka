import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';
import { upload } from '../config/upload';
import { uploadFile } from '../controllers/uploadController';
import {
  getAdminTours, createTour, updateTour, deleteTour, getAdminTourById
} from '../controllers/tourController';
import {
  getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem
} from '../controllers/galleryController';
import {
  getAdminPages, updatePage
} from '../controllers/pageController';
import {
  getAdminInquiries, updateInquiry
} from '../controllers/inquiryController';
import { updateSettings } from '../controllers/settingController';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

// Uploads
router.post('/upload', upload.single('file'), uploadFile);

// Tours
router.get('/tours', getAdminTours);
router.get('/tours/:id', getAdminTourById);
router.post('/tours', createTour);
router.put('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

// Gallery
router.get('/gallery', getAdminGallery);
router.post('/gallery', createGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// Pages
router.get('/pages', getAdminPages);
router.put('/pages/:id', updatePage);

// Inquiries
router.get('/inquiries', getAdminInquiries);
router.patch('/inquiries/:id', updateInquiry);

// Settings
router.put('/settings', updateSettings);

export default router;
