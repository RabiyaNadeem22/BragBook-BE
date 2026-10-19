import { authService } from '../services/auth.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { setAuthCookie, clearAuthCookie } from '../utils/token.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      setAuthCookie(res, token);
      return apiResponse.success(res, { user }, 'Account registered successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);
      setAuthCookie(res, token);
      return apiResponse.success(res, { user }, 'Signed in successfully');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    clearAuthCookie(res);
    return apiResponse.success(res, null, 'Signed out successfully');
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return apiResponse.success(res, { user }, 'Current user profile');
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      return apiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      await authService.changePassword(req.user.id, req.body);
      return apiResponse.success(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  },
};
