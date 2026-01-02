import { Router } from 'express';
import { getPublicTours, getPublicTourBySlug } from '../controllers/tourController';
import { getPublicGallery } from '../controllers/galleryController';
import { getHomeDestinations, getHomeExperiences } from '../controllers/homeController';
import { getPageByKey } from '../controllers/pageController';
import { createInquiry } from '../controllers/inquiryController';
import { getSettings } from '../controllers/settingController';
import { search } from '../controllers/searchController';
import rateLimit from 'express-rate-limit';

const router = Router();

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 inquiry requests per windowMs
  message: 'Too many inquiries from this IP, please try again after an hour',
});

// Tours
router.get('/tours', getPublicTours);
router.get('/tours/:slug', getPublicTourBySlug);

// Gallery
router.get('/gallery', getPublicGallery);

// Home Sections (Destinations/Experiences)
router.get('/destinations/featured', getHomeDestinations);
router.get('/experiences/featured', getHomeExperiences);

// Pages (About, Contact)
router.get('/pages/:key', getPageByKey);

// Settings
router.get('/settings', getSettings);

// Search
router.get('/search', search);

// Inquiry
router.post('/inquiries', inquiryLimiter, createInquiry);

export default router;
