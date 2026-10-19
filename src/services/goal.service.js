import { goalRepository } from '../repositories/goal.repository.js';
import { AppError } from '../utils/appError.js';

function withProgressDefaults({ status, progress }) {
  if (status === 'COMPLETED' && progress === undefined) return 100;
  if (status === 'NOT_STARTED' && progress === undefined) return 0;
  return progress;
}

export const goalService = {
  async list(userId, filters) {
    return goalRepository.findByUserId(userId, filters);
  },

  async getById(userId, goalId) {
    const goal = await goalRepository.findByIdAndUserId(goalId, userId);
    if (!goal) {
      throw new AppError('Goal not found.', 404);
    }
    return goal;
  },

  async create(userId, input) {
    const status = input.status || 'NOT_STARTED';
    const progress = withProgressDefaults({ status, progress: input.progress });

    return goalRepository.create({
      userId,
      title: input.title,
      description: input.description ?? null,
      status,
      priority: input.priority || 'MEDIUM',
      progress: progress ?? 0,
      deadline: input.deadline ?? null,
    });
  },

  async update(userId, goalId, input) {
    const existing = await this.getById(userId, goalId);

    const data = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.status !== undefined) data.status = input.status;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.deadline !== undefined) data.deadline = input.deadline;

    const nextStatus = input.status ?? existing.status;
    if (input.progress !== undefined) {
      data.progress = input.progress;
    } else if (input.status === 'COMPLETED') {
      data.progress = 100;
    } else if (input.status === 'NOT_STARTED' && existing.progress === 100) {
      data.progress = 0;
    }

    if (nextStatus === 'COMPLETED' && (data.progress ?? existing.progress) < 100 && input.progress === undefined) {
      data.progress = 100;
    }

    return goalRepository.update(goalId, data);
  },

  async delete(userId, goalId) {
    await this.getById(userId, goalId);
    await goalRepository.delete(goalId);
    return { id: goalId };
  },
};
