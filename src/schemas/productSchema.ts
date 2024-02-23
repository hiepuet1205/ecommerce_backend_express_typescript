import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.number().required(),
  countInStock: Joi.number().required(),
  rating: Joi.number(),
  description: Joi.string(),
  discount: Joi.number(),
  selled: Joi.number(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.number().required(),
  countInStock: Joi.number().required(),
  rating: Joi.number().required(),
  description: Joi.string(),
  discount: Joi.number(),
  selled: Joi.number(),
});

export const deleteManyProductSchema = Joi.object({
  ids: Joi.array().items(Joi.number()).required(),
});

export const getProductOfTypeSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
});