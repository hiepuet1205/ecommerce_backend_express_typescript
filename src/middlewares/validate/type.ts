import { RequestHandler, Request, Response, NextFunction } from "express";

import AppError from "../../ultis/appError";
import { createTypeSchema, updateTypeSchema } from "../../schemas/typeSchema";

export const validateCreateType: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createTypeSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};

export const validateUpdateType: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateTypeSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};