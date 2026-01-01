"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const upload_1 = require("../config/upload");
const uploadController_1 = require("../controllers/uploadController");
const tourController_1 = require("../controllers/tourController");
const galleryController_1 = require("../controllers/galleryController");
const pageController_1 = require("../controllers/pageController");
const inquiryController_1 = require("../controllers/inquiryController");
const settingController_1 = require("../controllers/settingController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.use(authMiddleware_1.requireAdmin);
// Uploads
router.post('/upload', upload_1.upload.single('file'), uploadController_1.uploadFile);
// Tours
router.get('/tours', tourController_1.getAdminTours);
router.get('/tours/:id', tourController_1.getAdminTourById);
router.post('/tours', tourController_1.createTour);
router.put('/tours/:id', tourController_1.updateTour);
router.delete('/tours/:id', tourController_1.deleteTour);
// Gallery
router.get('/gallery', galleryController_1.getAdminGallery);
router.post('/gallery', galleryController_1.createGalleryItem);
router.put('/gallery/:id', galleryController_1.updateGalleryItem);
router.delete('/gallery/:id', galleryController_1.deleteGalleryItem);
// Pages
router.get('/pages', pageController_1.getAdminPages);
router.put('/pages/:id', pageController_1.updatePage);
// Inquiries
router.get('/inquiries', inquiryController_1.getAdminInquiries);
router.patch('/inquiries/:id', inquiryController_1.updateInquiry);
// Settings
router.put('/settings', settingController_1.updateSettings);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map