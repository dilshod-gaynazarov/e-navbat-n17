import Joi from "joi";

export const createValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*d)(?=.*[$-,/@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/).required()
    });
    return admin.validate(data);
}

export const updateValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).optional(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*d)(?=.*[$-,/@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/).optional()
    });
    return admin.validate(data);
}