import Joi from "joi";

export const createValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        fullName: Joi.string().required(),
        special: Joi.string().required()
    });
    return doctor.validate(data);
}

export const updateValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional(),
        fullName: Joi.string().optional(),
        special: Joi.string().optional()
    });
    return doctor.validate(data);
}