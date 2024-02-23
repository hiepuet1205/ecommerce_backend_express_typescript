import { RequestHandler, Request, Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../ultis/types";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import jwt from 'jsonwebtoken';
import { Users } from "../models/userModel";
import config from "../config/index";

export const verifyAccessToken: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  let decoded: any
  try {
    decoded = jwt.verify(token, config.accessToken);
  } catch (error) {
    return res
      .status(200)
      .json({ name: 'TokenExpiredError', message: "Token expire" });
  }

  const user = await Users.findOne({ where: { id: decoded.id } })

  if (!user) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }
  req.user = {
    id: decoded.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    city: user.city,
  };

  next();
})

export const verifyRefreshToken: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded: any = jwt.verify(token, config.refreshToken);

  const user = await Users.findOne({ where: { id: decoded.id } })

  if (!user) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  req.user = {
    id: decoded.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
})

export const restrictTo = (roles: Array<string>) => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}