import { goalService } from '../services/goal.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const goalController = {
  async list(req, res, next) {
    try {
      const goals = await goalService.list(req.user.id, req.validatedQuery || req.query);
      return apiResponse.success(res, { goals }, 'Goals retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const goal = await goalService.getById(req.user.id, req.params.id);
      return apiResponse.success(res, { goal }, 'Goal retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const goal = await goalService.create(req.user.id, req.body);
      return apiResponse.success(res, { goal }, 'Goal created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const goal = await goalService.update(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, { goal }, 'Goal updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await goalService.delete(req.user.id, req.params.id);
      return apiResponse.success(res, result, 'Goal deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
