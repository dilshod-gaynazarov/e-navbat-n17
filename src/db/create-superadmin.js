import Admin from '../models/admin.model.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import { config } from 'dotenv';
config();

const crypto = new Crypto();

export const createSuperAdmin = async () => {
    try {
        const existsSuperAdmin = await Admin.findOne({ role: 'superadmin' });
        if (!existsSuperAdmin) {
            const hashedPassword = await crypto.encrypt(process.env.SUPERADMIN_PASSWORD);
            await Admin.create({
                username: process.env.SUPERADMIN_USERNAME,
                hashedPassword,
                role: 'superadmin'
            });
            console.log('Super admin created successfully');
        }
    } catch (error) {
        console.log(`Error on creating superadmin: ${error}`);
    }
}
