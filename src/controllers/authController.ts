import { RequestHandler, Request, Response, NextFunction } from "express";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Users } from "../models/userModel";
import bcrypt from 'bcrypt';
import { genneralAccessToken, genneralRefreshToken } from "../ultis/jwt";
import { IGetUserAuthInfoRequest } from "../ultis/types";

export const login: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const checkUser = await Users.findOne({ where: { email } })

  if (!checkUser) {
    return next(new AppError('Email not found!', 200))
  }

  const comparePassword = bcrypt.compareSync(password, checkUser.password)

  if (!comparePassword) {
    return next(new AppError('Password incorrect!', 200))
  }

  const access_token = await genneralAccessToken({ id: checkUser.id, role: checkUser.role })
  const refresh_token = await genneralRefreshToken({ id: checkUser.id, role: checkUser.role })

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    path: '/',
  })

  return res
    .status(200)
    .json({ message: "Login successfully", access_token, refresh_token });
})

export const refreshToken: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  let access_token = ""

  if (req.user) {
    access_token = await genneralAccessToken({ id: req.user.id, role: req.user.role })
  }

  return res
    .status(200)
    .json({ message: "Refresh token successfully", access_token });
})

export const logout: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  res.clearCookie('refresh_token')
  return res.status(200).json({
    status: 'OK',
    message: 'Logout successfully'
  })
})