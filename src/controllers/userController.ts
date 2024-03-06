import { RequestHandler, Request, Response, NextFunction } from "express";

import { IGetUserAuthInfoRequest } from "../ultis/types";

import catchAsync from "../ultis/catchAsync";
import AppError from "../ultis/appError";
import { Users } from "../models/userModel";
import bcrypt from 'bcrypt';
import APIFeatures from "../ultis/apiFeatures";
import crypto from "crypto";
import { sendEmail } from "../ultis/email";
import { Sequelize, Op } from "sequelize";

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

  const createdUser = await Users.create({
    name,
    email,
    password: hash,
    phone,
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
    .json({ message: "Get user successfully", data: { ...req.user, isAdmin: req.user?.role == "ADMIN" } });
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

export const forgotPassword: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await Users.findOne({ where: { email: req.body.email } })

  if (!user) {
    return next(new AppError('Email not found!', 200))
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  console.log(req.get('host'))
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err: any) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError('There was an error sending the email. Try again later!', 500),
    );
  }
})

export const resetPassword: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Users.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Sequelize.fn('NOW')
      }
    }
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired!', 400));
  }

  user.password = bcrypt.hashSync(req.body.password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Password reset successfully!'
  });
})

export const updatePassword: RequestHandler = catchAsync(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body
  if (newPassword != passwordConfirm) {
    return next(new AppError('The password is equal confirmPassword', 200))
  }

  if (!bcrypt.compareSync(oldPassword, req.user?.password as string)) {
    return next(new AppError('Old password is wrong!', 400));
  }

  const hash = bcrypt.hashSync(newPassword, 10)

  await Users.update({ password: hash }, { where: { id: req.user?.id } });

  return res
    .status(200)
    .json({ message: "Password update successfully" });
})
