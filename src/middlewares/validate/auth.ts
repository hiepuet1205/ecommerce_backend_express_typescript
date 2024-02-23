import { RequestHandler, Request, Response, NextFunction } from "express";

import { loginSchema } from "../../schemas/authSchema";
import AppError from "../../ultis/appError";

export const validateLogin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};