import { Request } from "express"

interface User {
  id: number;
  name: string,
  email: string,
  password?: string,
  avatar?: string,
  phone?: string,
  address?: string,
  city?: string,
  role: string
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: User;
}