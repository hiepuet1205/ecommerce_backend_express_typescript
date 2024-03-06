import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
});

export const deleteManyUserSchema = Joi.object({
  ids: Joi.array().items(Joi.number()).required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  password: Joi.string().required(),
});

export const updatePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});