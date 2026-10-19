import { prisma } from '../config/prisma.js';

export const goalRepository = {
  async findByUserId(userId, { status, priority } = {}) {
    return prisma.goal.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
    });
  },

  async findByIdAndUserId(id, userId) {
    return prisma.goal.findFirst({
      where: { id, userId },
    });
  },

  async create(data) {
    return prisma.goal.create({ data });
  },

  async update(id, data) {
    return prisma.goal.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.goal.delete({
      where: { id },
    });
  },
};
