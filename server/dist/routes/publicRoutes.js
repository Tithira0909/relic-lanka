"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourController_1 = require("../controllers/tourController");
const galleryController_1 = require("../controllers/galleryController");
const pageController_1 = require("../controllers/pageController");
const inquiryController_1 = require("../controllers/inquiryController");
const settingController_1 = require("../controllers/settingController");
const searchController_1 = require("../controllers/searchController");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
const inquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 inquiry requests per windowMs
    message: 'Too many inquiries from this IP, please try again after an hour',
});
// Tours
router.get('/tours', tourController_1.getPublicTours);
router.get('/tours/:slug', tourController_1.getPublicTourBySlug);
// Gallery
router.get('/gallery', galleryController_1.getPublicGallery);
// Pages (About, Contact)
router.get('/pages/:key', pageController_1.getPageByKey);
// Settings
router.get('/settings', settingController_1.getSettings);
// Search
router.get('/search', searchController_1.search);
// Inquiry
router.post('/inquiries', inquiryLimiter, inquiryController_1.createInquiry);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map