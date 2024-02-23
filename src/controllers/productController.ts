import { RequestHandler, Response, NextFunction } from "express";

import { IGetUserAuthInfoRequest } from "../ultis/types";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Products } from "../models/productModel";

import APIFeatures from "../ultis/apiFeatures";

export const createProduct: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkProduct = await Products.findOne({ where: { name: req.body.name } });

  if (checkProduct) {
    return next(new AppError('The name of product is already', 401))
  }

  const product = await Products.create(req.body);

  return res
    .status(200)
    .json({
      message: "Product create successfully", data: product
    });
})

export const updateProduct: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkProduct = await Products.findOne({ where: { id: req.params.id } });

  if (!checkProduct) {
    return next(new AppError('The product is not defined', 401))
  }

  const product = await Products.update({ ...req.body }, { where: { id: req.params.id } });

  return res
    .status(200)
    .json({
      message: "Product update successfully", data: product
    });
})

export const getProduct: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkProduct = await Products.findOne({ where: { id: req.params.id } });

  if (!checkProduct) {
    return next(new AppError('The product is not defined', 401))
  }

  return res
    .status(200)
    .json({
      message: "Get product successfully", data: checkProduct
    });
})

export const getAllProducts: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const apiFeatures = new APIFeatures(Products, req.query)

  const products = await apiFeatures.filter().sort().paginate().limitFields().exec();

  return res
    .status(200)
    .json({
      message: "Get all product successfully", data: products
    });
})

export const getAllType: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const result = await Products.sequelize?.query('select distinct type from products;');

  const types = result && result.length > 0 ? result[0] : [];

  return res
    .status(200)
    .json({
      message: "Get all type product successfully", data: types.map((type: any) => { return type.type })
    });
});

export const getProductOfType: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const products = await Products.findAll({ where: { type: req.body.type } });

  return res
    .status(200)
    .json({
      message: "Get all product successfully", data: products
    });
})

export const deleteProduct: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkProduct = await Products.findOne({ where: { id: req.params.id } });

  if (!checkProduct) {
    return next(new AppError('The product is not defined', 401))
  }

  await Products.destroy({ where: { id: req.params.id } });

  return res
    .status(200)
    .json({
      message: "Product delete successfully"
    });
})

export const deleteManyProduct: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  await Products.destroy({ where: { id: req.body.ids } })

  return res
    .status(200)
    .json({ message: "Delete successfully" });
})