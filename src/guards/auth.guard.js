import config from "../config/index.js";
import { handleError } from "../helpers/error-handle.js";
import { Token } from "../utils/token-service.js";

const tokenService = new Token();

export const AuthGuard = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return handleError(res, 'Authorization error', 401);
    }
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];
    if (!bearer || bearer != 'Bearer' || !token) {
        return handleError(res, 'Token error', 401);
    }
    try {
        const user = await tokenService.verifyToken(
            token,
            config.ACCESS_TOKEN_KEY
        );
        req.user = user;
        next();
    } catch (error) {
        return handleError(res, 'Unathorized', 401);
    }
}