import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
});

/**
 * Generate a signed JWT token
 * @param {object} payload
 * @param {string} payload.id - User ID
 * @param {string} payload.email - User email
 * @returns {string}
 */
export const generateToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.id,
      email: payload.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Set authentication cookie on HTTP response
 * @param {import('express').Response} res
 * @param {string} token
 */
export const setAuthCookie = (res, token) => {
  res.cookie(env.COOKIE_NAME, token, getCookieOptions());
};

/**
 * Clear authentication cookie from HTTP response
 * @param {import('express').Response} res
 */
export const clearAuthCookie = (res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
};
