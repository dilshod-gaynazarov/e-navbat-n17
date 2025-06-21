import Admin from '../models/admin.model.js';
import { handleError } from '../helpers/error-handle.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import { successRes } from '../helpers/success-response.js';
import { createAdminValidator, updateAdminValidator } from '../validation/admin.validation.js';
import { isValidObjectId } from 'mongoose';
import { Token } from '../utils/token-service.js';

const crypto = new Crypto();
const token = new Token();

export class AdminController {
    async createAdmin(req, res) {
        try {
            const { value, error } = createAdminValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsUsername = await Admin.findOne({ username: value.username });
            if (existsUsername) {
                return handleError(res, 'Username already exists', 409);
            }
            const hashedPassword = await crypto.encrypt(value.password);
            const admin = await Admin.create({
                username: value.username,
                hashedPassword
            });
            return successRes(res, admin, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async signInAdmin(req, res) {
        try {
            const { value, error } = createAdminValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const admin = await Admin.findOne({ username: value.username });
            if (!admin) {
                return handleError(res, 'Admin not found', 404);
            }
            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return successRes(res, {
                data: admin,
                token: accessToken
            }, 200);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return handleError(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return handleError(res, 'Invalid token', 400);
            }
            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return handleError(res, 'Admin not found', 404);
            }
            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            return successRes(res, {
                token: accessToken
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async logOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return handleError(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return handleError(res, 'Invalid token', 400);
            }
            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return handleError(res, 'Admin not found', 404);
            }
            res.clearCookie('refreshTokenAdmin');
            return successRes(res, {});
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAllAdmins(_, res) {
        try {
            const admins = await Admin.find();
            return successRes(res, admins);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAdminById(req, res) {
        try {
            const admin = await AdminController.findAdminById(res, req.params.id);
            return successRes(res, admin);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateAdmin(req, res) {
        try {
            const id = req.params.id;
            const admin = await AdminController.findAdminById(res, id);
            const { value, error } = updateAdminValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            let hashedPassword = admin.hashedPassword;
            if (value.password) {
                hashedPassword = await crypto.encrypt(password);
            }
            const updatedAdmin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });
            return successRes(res, updatedAdmin);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async deleteAdmin(req, res) {
        try {
            const id = req.params.id;
            await AdminController.findAdminById(res, id);
            await Admin.findByIdAndDelete(id);
            return successRes(res, { message: 'Admin deleted successfully' });
        } catch (error) {
            return handleError(res, error);
        }
    }

    static async findAdminById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid object ID', 400);
            }
            const admin = await Admin.findById(id);
            if (!admin) {
                return handleError(res, 'Admin not found', 404);
            }
            return admin;
        } catch (error) {
            return handleError(res, error);
        }
    }
}