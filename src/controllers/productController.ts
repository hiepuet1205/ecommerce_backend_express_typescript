import { RequestHandler, Response, NextFunction } from "express";

import { IGetUserAuthInfoRequest } from "../ultis/types";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Products } from "../models/productModel";

import APIFeatures from "../ultis/apiFeatures";
import { ProductImages } from "../models/productImageModel";

export const createProduct: RequestHandler = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const checkProduct = await Products.findOne({ where: { name: req.body.name } });

  if (checkProduct) {
    return next(new AppError('The name of product is already', 401))
  }

  if (req.files) {
    req.body.image = ""
    const product = await Products.create(req.body);
    req.files.forEach(async (file: { location: any; }) => {
      await ProductImages.create({ product: product.id, image: file.location })
    })
    return res
      .status(200)
      .json({
        message: "Product create successfully", data: product
      });
  } else {
    return next(new AppError('Cant upload image!', 400))
  }
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
  const checkProduct = await Products.findOne({ where: { id: req.params.id }, attributes: { exclude: ['createdAt', 'updatedAt'] } });

  if (!checkProduct) {
    return next(new AppError('The product is not defined', 401))
  }

  const productImages = await ProductImages.findAll({ where: { product: req.params.id } });

  return res
    .status(200)
    .json({
      message: "Get product successfully", data: { ...checkProduct.get(), images: productImages.map(i => i.image) }
    });
})

export const getAllProducts: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const apiFeatures = new APIFeatures(Products, req.query)

  const products = await apiFeatures.filter().sort().paginate().limitFields().exec();

  const productDatas = await Promise.all(products.map(async product => {
    const productImages = await ProductImages.findAll({ where: { product: product.id } });

    return {
      ...product.get(),
      images: productImages.map(i => i.image)
    }
  }))

  return res
    .status(200)
    .json({
      message: "Get all product successfully", data: productDatas
    });
})

export const getProductOfType: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const products = await Products.findAll({ where: { type: req.body.type } });

  const productDatas = await Promise.all(products.map(async product => {
    const productImages = await ProductImages.findAll({ where: { product: product.id } });

    return {
      ...product.get(),
      images: productImages.map(i => i.image)
    }
  }))

  return res
    .status(200)
    .json({
      message: "Get all product successfully", data: productDatas
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