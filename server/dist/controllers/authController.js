"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const payload = { userId: user.id, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        res.json({ accessToken, refreshToken, user: { email: user.email, role: user.role } });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!payload) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }
    const newPayload = { userId: user.id, role: user.role };
    const newAccessToken = (0, jwt_1.generateAccessToken)(newPayload);
    // Optionally rotate refresh token here
    res.json({ accessToken: newAccessToken });
};
exports.refresh = refresh;
const logout = (req, res) => {
    // Client should discard tokens. Server-side blacklist is optional MVP.
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map