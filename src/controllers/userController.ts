import { RequestHandler, Request, Response, NextFunction } from "express";

import { IGetUserAuthInfoRequest } from "../ultis/types";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Users } from "../models/userModel";
import bcrypt from 'bcrypt';
import APIFeatures from "../ultis/apiFeatures";

export const register: RequestHandler = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { name, email, password, confirmPassword, phone } = req.body

  if (password != confirmPassword) {
    return next(new AppError('The password is equal confirmPassword', 200))
  }

  const checkUser = await Users.findOne({ where: { email } })

  if (checkUser) {
    return next(new AppError('The email is already', 200))
  }

  const hash = bcrypt.hashSync(password, 10)

  let avatar
  if (req.file) {
    avatar = req.file.location
    const createdUser = await Users.create({
      name,
      email,
      password: hash,
      phone,
      avatar,
    })
    return res
      .status(200)
      .json({
        message: "User create successfully", data: {
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          avatar: createdUser.avatar
        }
      });
  } else {
    return next(new AppError('Cant upload avatar!', 400))
  }
})

export const updateInfo: RequestHandler = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  let user
  if (req.user) {
    const checkUser = await Users.findOne({ where: { id: req.user.id } })
    if (!checkUser) {
      return next(new AppError('User not found!', 200))
    }

    if (req.file) {
      req.body.avatar = req.file.location
      user = await Users.update({ ...req.body }, { where: { id: req.user.id } })
      return res
        .status(200)
        .json({ message: "User update successfully", data: user });
    } else {
      return next(new AppError('Cant upload avatar!', 400))
    }
  }
})

export const getInfo = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  return res
    .status(200)
    .json({ message: "Get user successfully", data: req.user });
})

export const getUser: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkUser = await Users.findOne({ where: { id: req.params.id } })

  if (!checkUser) {
    return next(new AppError('User not found!', 200))
  }

  return res
    .status(200)
    .json({
      message: "Get user successfully", data: {
        name: checkUser.name,
        email: checkUser.email,
        phone: checkUser.phone
      }
    });
})

export const getAllUser: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const apiFeatures = new APIFeatures(Users, req.query)

  const users = await apiFeatures.filter().sort().paginate().limitFields().exec();

  return res
    .status(200)
    .json({ message: "Get user successfully", data: users });
})

export const createUser: RequestHandler = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const { name, email, password, confirmPassword, address, city, phone } = req.body

  if (password != confirmPassword) {
    return next(new AppError('The password is equal confirmPassword', 200))
  }

  const checkUser = await Users.findOne({ where: { email } })

  if (checkUser) {
    return next(new AppError('The email is already', 200))
  }

  const hash = bcrypt.hashSync(password, 10)

  let avatar
  if (req.file) {
    avatar = req.file.location
    const createdUser = await Users.create({
      name,
      email,
      password: hash,
      phone,
      avatar,
      address,
      city
    })
    return res
      .status(200)
      .json({
        message: "User create successfully", data: {
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          avatar: createdUser.avatar
        }
      });
  } else {
    return next(new AppError('Cant upload avatar!', 400))
  }
})

export const updateUser: RequestHandler = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const checkUser = await Users.findOne({ where: { id: req.params.id } })

  if (!checkUser) {
    return next(new AppError('Email not found!', 200))
  }

  let avatar
  if (req.file) {
    avatar = req.file.location
  }

  const user = await Users.update({ ...req.body, avatar }, { where: { id: req.params.id } })

  return res
    .status(200)
    .json({ message: "User update successfully", data: user });
})

export const deleteUser: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const checkUser = await Users.findOne({ where: { id: req.params.id } })

  if (!checkUser) {
    return next(new AppError('User not found!', 200))
  }

  await Users.destroy({ where: { id: req.params.id } })

  return res
    .status(200)
    .json({ message: "User delete successfully" });
})

export const deleteManyUser: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  await Users.destroy({ where: { id: req.body.ids } })

  return res
    .status(200)
    .json({ message: "Delete successfully" });
})
