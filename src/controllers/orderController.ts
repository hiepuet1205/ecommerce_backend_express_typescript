import { ShippingAddresses } from './../models/shippingAddressModel';
import { RequestHandler, Request, Response, NextFunction } from "express";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Products } from "../models/productModel";
import { IGetUserAuthInfoRequest } from '../ultis/types';
import { Orders } from '../models/orderModel';
import { OrderItems } from '../models/orderItemModel';
import APIFeatures from '../ultis/apiFeatures';

export const createOrder: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { orderItems, paymentMethod, deliveryMethod, itemsPrice, shippingPrice, totalPrice, isPaid, name, address, city, phone } = req.body

  if (req.user) {
    const promiseUpdateProducts = orderItems.map(async (item: any) => {
      const product = await Products.findByPk(item.productId);

      if (!product) {
        return next(new AppError(`Product with id:${item.productId} not found`, 404));
      }

      if (product.countInStock < item.amount) {
        return next(new AppError(`Product with id:${item.productId} is out of stock`, 400));
      }

      product.countInStock -= item.amount;
      product.selled += item.amount;
      await Products.update(product, { where: { id: item.productId } })
    })

    await Promise.all(promiseUpdateProducts)

    const newOrder = await Orders.create({
      paymentMethod,
      deliveryMethod,
      itemsPrice,
      shippingPrice,
      totalPrice: totalPrice,
      user: req.user.id,
      isPaid,
      isDelivered: false,
    })

    const newShippingAddress = await ShippingAddresses.create({
      fullname: name,
      address,
      phone,
      city,
      order: newOrder.id,
    })

    const promiseCreateOrderItems = orderItems.map(async (item: any) => {
      return await OrderItems.create({
        order: newOrder.id,
        amount: item.amount,
        price: item.price,
        discount: item.discount,
        product: item.productId,
        image: item.image
      })
    })

    const items = await Promise.all(promiseCreateOrderItems)

    return res
      .status(201)
      .json({
        message: "Order created successfully",
        data: { newOrder, items, newShippingAddress }
      });
  }
})

// ADMIN
export const getAllOrder: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const apiFeatures = new APIFeatures(Products, req.query)

  const orders = await apiFeatures.filter().sort().paginate().limitFields().exec();

  const results = await Promise.all(orders.map(async order => {
    const items = await OrderItems.findAll({ where: { order: order.id } });
    const shippingAddress = await ShippingAddresses.findOne({ where: { order: order.id } })

    return { order, items, shippingAddress }
  }))

  return res
    .status(200)
    .json({
      status: 200,
      message: "Get all orders successfully",
      data: results
    })
})

export const getDetailsOrder: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const order = await Orders.findByPk(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const items = await OrderItems.findAll({ where: { order: req.params.id } });
  const shippingAddress = await ShippingAddresses.findOne({ where: { order: req.params.id } })

  return res
    .status(200)
    .json({
      message: "Order details",
      data: {
        order,
        items,
        shippingAddress
      }
    });
})

export const getAllOrderOfUser: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    const orders = await Orders.findAll({ where: { user: req.user.id } });

    const results = await Promise.all(orders.map(async order => {
      const items = await OrderItems.findAll({ where: { order: order.id } });
      const shippingAddress = await ShippingAddresses.findOne({ where: { order: order.id } })

      return { order, items, shippingAddress }
    }))

    return res
      .status(200)
      .json({
        status: 200,
        message: "Get all orders successfully",
        data: results
      })
  }
});

export const cancelOrder: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    const order = await Orders.findByPk(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    await OrderItems.destroy({ where: { order: req.params.id } });
    await ShippingAddresses.destroy({ where: { order: req.params.id } })
    await Orders.destroy({ where: { id: req.params.id } });

    return res
      .status(200)
      .json({
        status: 200,
        message: "Cancel order successfully",
      })
  }
})