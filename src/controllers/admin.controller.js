import Admin from '../models/admin.model.js';
import { handleError } from '../helpers/error-handle.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import { successRes } from '../helpers/success-response.js';

const crypto = new Crypto();

export class AdminController {
    async createAdmin(req, res) {
        try {
            const { username, password } = req.body;
            const existsUsername = await Admin.findOne({ username });
            if (existsUsername) {
                return handleError(res, 'Username already exists', 409);
            }
            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                username,
                hashedPassword
            });
            return successRes(res, admin, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }
}