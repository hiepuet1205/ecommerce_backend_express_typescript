import { RequestHandler, Request, Response, NextFunction } from "express";
import AppError from "../../ultis/appError";

import { createProductSchema, updateProductSchema, deleteManyProductSchema, getProductOfTypeSchema } from "../../schemas/productSchema";

export const validateCreateProduct: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createProductSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
};

export const validateUpdateProduct: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
}

export const validateDeleteManyProduct: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = deleteManyProductSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
}

export const validateGetProductOfType: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { error } = getProductOfTypeSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 200))
  }
  next();
}