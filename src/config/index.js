import { config } from "dotenv";
config();

export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SUPERADMIN_USERNAME: process.env.SUPERADMIN_USERNAME,
    SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS
}