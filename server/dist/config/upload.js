"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const env_1 = require("../utils/env");
// Determine storage engine
let storage;
if (env_1.ENV.STORAGE_PROVIDER === 's3' && env_1.ENV.S3_BUCKET && env_1.ENV.S3_ACCESS_KEY && env_1.ENV.S3_SECRET_KEY && env_1.ENV.S3_ENDPOINT) {
    const s3 = new client_s3_1.S3Client({
        region: 'auto',
        endpoint: env_1.ENV.S3_ENDPOINT,
        credentials: {
            accessKeyId: env_1.ENV.S3_ACCESS_KEY,
            secretAccessKey: env_1.ENV.S3_SECRET_KEY,
        },
    });
    storage = (0, multer_s3_1.default)({
        s3: s3,
        bucket: env_1.ENV.S3_BUCKET,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
        }
    });
}
else {
    // Local storage fallback
    const uploadDir = path_1.default.join(__dirname, '../../../uploads');
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
        },
    });
}
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only images are allowed'));
        }
    }
});
//# sourceMappingURL=upload.js.map