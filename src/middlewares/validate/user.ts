import { RequestHandler, Request, Response, NextFunction } from "express";

import { registerSchema, updateUserSchema, deleteManyUserSchema, forgotPasswordSchema, resetPassword, updatePassword } from "../../schemas/userSchema";
import AppError from "../../ultis/appError";

export const validateRegister: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};

export const validateUpdateUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
}

export const validateDeleteManyUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = deleteManyUserSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
}

export const validateForgotPassword: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};

export const validateResetPassword: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = resetPassword.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};

export const validateUpdatePassword: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updatePassword.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};