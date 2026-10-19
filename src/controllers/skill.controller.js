import { skillService } from '../services/skill.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const skillController = {
  async getSkills(req, res, next) {
    try {
      const skills = await skillService.getUserSkills(req.user.id, req.validatedQuery || req.query);
      return apiResponse.success(res, { skills }, 'Skills retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getSkill(req, res, next) {
    try {
      const skill = await skillService.getById(req.user.id, req.params.id);
      return apiResponse.success(res, { skill }, 'Skill retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createSkill(req, res, next) {
    try {
      const skill = await skillService.createSkill(req.user.id, req.body);
      return apiResponse.success(res, { skill }, 'Skill added successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateSkill(req, res, next) {
    try {
      const skill = await skillService.updateSkill(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, { skill }, 'Skill updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteSkill(req, res, next) {
    try {
      const result = await skillService.deleteSkill(req.user.id, req.params.id);
      return apiResponse.success(res, result, 'Skill deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
