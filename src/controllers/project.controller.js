import { projectService } from '../services/project.service.js';
import { apiResponse } from '../utils/apiResponse.js';

export const projectController = {
  async list(req, res, next) {
    try {
      const projects = await projectService.list(req.user.id, req.validatedQuery || req.query);
      return apiResponse.success(res, { projects }, 'Projects retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.user.id, req.params.id);
      return apiResponse.success(res, { project }, 'Project retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const project = await projectService.create(req.user.id, req.body);
      return apiResponse.success(res, { project }, 'Project created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const project = await projectService.update(req.user.id, req.params.id, req.body);
      return apiResponse.success(res, { project }, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await projectService.delete(req.user.id, req.params.id);
      return apiResponse.success(res, result, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
