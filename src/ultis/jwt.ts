import jwt from 'jsonwebtoken';
import config from '../config/index'

export const genneralAccessToken = async (payload: any) => {
  const access_token = jwt.sign({
    ...payload
  }, config.accessToken, { expiresIn: '1d' })

  return access_token
}

export const genneralRefreshToken = async (payload: any) => {
  const refresh_token = jwt.sign({
    ...payload
  }, config.refreshToken, { expiresIn: '365d' })

  return refresh_token
}