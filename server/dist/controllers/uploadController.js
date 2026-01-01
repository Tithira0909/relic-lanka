"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const env_1 = require("../utils/env");
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    let fileUrl;
    // Check if S3 was used (multer-s3 adds 'location' property)
    const fileWithLocation = req.file;
    if (fileWithLocation.location) {
        fileUrl = fileWithLocation.location;
        // Handle Cloudflare R2 or other S3 compatible public URLs if needed
        if (env_1.ENV.S3_PUBLIC_URL) {
            // Replace endpoint with public URL if specified
            // This is a simple replacement logic, might need adjustment based on specific provider URL structure
            const filename = fileWithLocation.key;
            fileUrl = `${env_1.ENV.S3_PUBLIC_URL}/${filename}`;
        }
    }
    else {
        // Local storage
        fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    res.json({ url: fileUrl });
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=uploadController.js.map