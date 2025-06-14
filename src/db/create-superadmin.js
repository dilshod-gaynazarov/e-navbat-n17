import Admin from '../models/admin.model.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import config from '../config/index.js';

const crypto = new Crypto();

export const createSuperAdmin = async () => {
    try {
        const existsSuperAdmin = await Admin.findOne({ role: 'superadmin' });
        if (!existsSuperAdmin) {
            const hashedPassword = await crypto.encrypt(config.SUPERADMIN_PASSWORD);
            await Admin.create({
                username: config.SUPERADMIN_USERNAME,
                hashedPassword,
                role: 'superadmin'
            });
            console.log('Super admin created successfully');
        }
    } catch (error) {
        console.log(`Error on creating superadmin: ${error}`);
    }
}
