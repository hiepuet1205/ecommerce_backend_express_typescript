import { RequestHandler, Request, Response, NextFunction } from "express";

import catchAsync from "../ultis/catchAsync";
import { Types } from "../models/typeModel";
import AppError from "../ultis/appError";


export const getAllType: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const types = await Types.findAll();

  return res
    .status(200)
    .json({
      message: "Get all type product successfully", data: types
    })
});

export const createType: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newType = await Types.create(req.body);

  return res
    .status(201)
    .json({
      message: "Create type product successfully", data: newType
    })
})

export const updateType: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const checkType = await Types.findOne({ where: { id: req.params.id } });

  if (!checkType) {
    return next(new AppError('The type is not defined', 401))
  }

  const updatedType = await Types.update(req.body, { where: { id: req.params.id } });

  return res
    .status(200)
    .json({
      message: "Update type product successfully", data: updatedType
    })
})

export const deleteType: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const checkType = await Types.findOne({ where: { id: req.params.id } });

  if (!checkType) {
    return next(new AppError('The type is not defined', 401))
  }

  const deletedType = await Types.destroy({ where: { id: req.params.id } });

  return res
    .status(200)
    .json({
      message: "Delete type product successfully", data: deletedType
    })
})