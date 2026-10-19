import { prisma } from '../config/prisma.js';

const projectInclude = {
  _count: {
    select: { achievements: true },
  },
};

export const projectRepository = {
  async findByUserId(userId, { status } = {}) {
    return prisma.project.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: projectInclude,
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async findByIdAndUserId(id, userId) {
    return prisma.project.findFirst({
      where: { id, userId },
      include: projectInclude,
    });
  },

  async create(data) {
    return prisma.project.create({
      data,
      include: projectInclude,
    });
  },

  async update(id, data) {
    return prisma.project.update({
      where: { id },
      data,
      include: projectInclude,
    });
  },

  async delete(id) {
    return prisma.project.delete({
      where: { id },
    });
  },
};
