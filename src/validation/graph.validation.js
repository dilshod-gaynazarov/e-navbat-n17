import Joi from "joi";

export const createGraphValidator = (data) => {
    const graph = Joi.object({
        schedule: Joi.date().required(),
        status: Joi.string().valid('free', 'busy').required(),
        doctorId: Joi.string().required()
    });
    return graph.validate(data);
}

export const updateGraphValidator = (data) => {
    const graph = Joi.object({
        schedule: Joi.date().optional(),
        status: Joi.string().valid('free', 'busy').optional(),
        doctorId: Joi.string().optional()
    });
    return graph.validate(data);
}