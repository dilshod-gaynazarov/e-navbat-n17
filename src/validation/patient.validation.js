import Joi from "joi";

export const signUpPatientValidator = (data) => {
    const patient = Joi.object({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        email: Joi.string().email().required(),
        address: Joi.string().optional(),
        gender: Joi.string().valid('male', 'female').required(),
        age: Joi.number().required()
    });
    return patient.validate(data);
}

export const signInPatientValidator = (data) => {
    const patient = Joi.object({
        email: Joi.string().email().required(),
    });
    return patient.validate(data);
}

export const confirmSignInPatientValidator = (data) => {
    const patient = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    });
    return patient.validate(data);
}

export const updatePatientValidator = (data) => {
    const patient = Joi.object({
        fullName: Joi.string().optional(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional(),
        email: Joi.string().email().required(),
        address: Joi.string().optional(),
        gender: Joi.string().valid('male', 'female').optional(),
        age: Joi.number().optional()
    });
    return patient.validate(data);
}