import { achievementRepository } from '../repositories/achievement.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { AppError } from '../utils/appError.js';

async function assertProjectOwnership(userId, projectId) {
  if (!projectId) return null;
  const project = await projectRepository.findByIdAndUserId(projectId, userId);
  if (!project) {
    throw new AppError('Project not found.', 404);
  }
  return project;
}

function evidenceCreate(items = []) {
  return items.map((item) => ({
    title: item.title,
    url: item.url,
    type: item.type || 'URL',
  }));
}

export const achievementService = {
  async list(userId, filters) {
    return achievementRepository.findByUserId(userId, filters);
  },

  async getById(userId, achievementId) {
    const achievement = await achievementRepository.findByIdAndUserId(achievementId, userId);
    if (!achievement) {
      throw new AppError('Achievement not found.', 404);
    }
    return achievement;
  },

  async create(userId, input) {
    await assertProjectOwnership(userId, input.projectId);
    const tags = await achievementRepository.upsertTags(userId, input.tags || []);

    return achievementRepository.create({
      userId,
      title: input.title,
      description: input.description,
      date: input.date || new Date(),
      category: input.category || 'TECHNICAL',
      impact: input.impact ?? null,
      metrics: input.metrics ?? null,
      projectId: input.projectId ?? null,
      tags: {
        connect: tags.map((tag) => ({ id: tag.id })),
      },
      evidence: {
        create: evidenceCreate(input.evidence),
      },
    });
  },

  async update(userId, achievementId, input) {
    await this.getById(userId, achievementId);

    if (input.projectId !== undefined) {
      await assertProjectOwnership(userId, input.projectId);
    }

    const data = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.date !== undefined) data.date = input.date;
    if (input.category !== undefined) data.category = input.category;
    if (input.impact !== undefined) data.impact = input.impact;
    if (input.metrics !== undefined) data.metrics = input.metrics;
    if (input.projectId !== undefined) data.projectId = input.projectId;

    if (input.tags !== undefined) {
      const tags = await achievementRepository.upsertTags(userId, input.tags);
      data.tags = { set: tags.map((tag) => ({ id: tag.id })) };
    }

    if (input.evidence !== undefined) {
      data.evidence = {
        deleteMany: {},
        create: evidenceCreate(input.evidence),
      };
    }

    return achievementRepository.update(achievementId, data);
  },

  async delete(userId, achievementId) {
    await this.getById(userId, achievementId);
    await achievementRepository.delete(achievementId);
    return { id: achievementId };
  },
};
