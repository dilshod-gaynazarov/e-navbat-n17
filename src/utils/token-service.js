import jwt from "jsonwebtoken";
import config from '../config/index.js';

export class Token {
    async generateAccessToken(payload) {
        return jwt.sign(payload, config.ACCESS_TOKEN_KEY, {
            expiresIn: config.ACCESS_TOKEN_TIME
        });
    }

    async generateRefreshToken(payload) {
        return jwt.sign(payload, config.REFRESH_TOKEN_KEY, {
            expiresIn: config.REFRESH_TOKEN_TIME
        });
    }

    async verifyToken(token, secretKey) {
        return jwt.verify(token, secretKey);
    }
}