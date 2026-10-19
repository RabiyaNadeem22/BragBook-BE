import { achievementService } from '../services/achievement.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const achievementController = {
  async list(req, res, next) {
    try {
      const achievements = await achievementService.list(req.user.id, req.validatedQuery || req.query);
      return apiResponse.success(res, { achievements }, 'Achievements retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const achievement = await achievementService.getById(req.user.id, req.params.id);
      return apiResponse.success(res, { achievement }, 'Achievement retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const achievement = await achievementService.create(req.user.id, req.body);
      return apiResponse.success(res, { achievement }, 'Achievement recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const achievement = await achievementService.update(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, { achievement }, 'Achievement updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await achievementService.delete(req.user.id, req.params.id);
      return apiResponse.success(res, result, 'Achievement deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
