import { projectRepository } from '../repositories/project.repository.js';
import { AppError } from '../utils/appError.js';

export const projectService = {
  async list(userId, filters) {
    return projectRepository.findByUserId(userId, filters);
  },

  async getById(userId, projectId) {
    const project = await projectRepository.findByIdAndUserId(projectId, userId);
    if (!project) {
      throw new AppError('Project not found.', 404);
    }
    return project;
  },

  async create(userId, input) {
    return projectRepository.create({
      userId,
      name: input.name,
      description: input.description ?? null,
      role: input.role ?? null,
      technologies: input.technologies || [],
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      status: input.status || 'IN_PROGRESS',
    });
  },

  async update(userId, projectId, input) {
    await this.getById(userId, projectId);

    const data = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.role !== undefined) data.role = input.role;
    if (input.technologies !== undefined) data.technologies = input.technologies;
    if (input.startDate !== undefined) data.startDate = input.startDate;
    if (input.endDate !== undefined) data.endDate = input.endDate;
    if (input.status !== undefined) data.status = input.status;

    return projectRepository.update(projectId, data);
  },

  async delete(userId, projectId) {
    await this.getById(userId, projectId);
    await projectRepository.delete(projectId);
    return { id: projectId };
  },
};
