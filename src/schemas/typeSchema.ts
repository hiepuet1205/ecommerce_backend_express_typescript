import Joi from "joi";

export const createTypeSchema = Joi.object({
  name: Joi.string().required(),
});

export const updateTypeSchema = Joi.object({
  name: Joi.string().required(),
});