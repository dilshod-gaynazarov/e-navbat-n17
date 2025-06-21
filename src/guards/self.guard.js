import { handleError } from "../helpers/error-handle.js"

export const SelfGuard = (req, res, next) => {
    if (req.user?.role === 'superadmin' || req.user?.id == req.params?.id) {
        return next();
    } else {
        return handleError(res, 'Forbidden user', 403);
    }
}