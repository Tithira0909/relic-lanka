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
import {
  getAdminDestinations, createDestination, updateDestination, deleteDestination, getDestinationById
} from '../controllers/destinationController';
import {
  getAdminExperiences, createExperience, updateExperience, deleteExperience, getExperienceById
} from '../controllers/experienceController';

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

// Destinations (Separate)
router.get('/destinations', getAdminDestinations);
router.get('/destinations/:id', getDestinationById);
router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

// Experiences (Separate)
router.get('/experiences', getAdminExperiences);
router.get('/experiences/:id', getExperienceById);
router.post('/experiences', createExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);

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
