import { verifyToken } from '../utils/token.js';
import { prisma } from '../config/prisma.js';
import { apiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

/**
 * Authentication middleware to protect private endpoints
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies[env.COOKIE_NAME]) {
      token = req.cookies[env.COOKIE_NAME];
    }
    // 2. Fallback to Authorization: Bearer <token> header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return apiResponse.error(
        res,
        'Authentication required. Please sign in to access this resource.',
        401
      );
    }

    // 3. Verify token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return apiResponse.error(
        res,
        'Invalid or expired authentication token.',
        401
      );
    }

    // 4. Look up user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        jobTitle: true,
        company: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return apiResponse.error(
        res,
        'The user belonging to this token no longer exists.',
        401
      );
    }

    // 5. Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return apiResponse.error(res, 'Invalid authentication token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return apiResponse.error(
        res,
        'Your session has expired. Please sign in again.',
        401
      );
    }
    next(error);
  }
};
